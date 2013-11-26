{-# LANGUAGE OverloadedStrings #-}
module Main where

import Control.Monad (liftM)
import Data.Maybe (fromMaybe)
import Data.Monoid (mappend, mconcat)
import Data.Map (lookup)
import System.Locale (iso8601DateFormat)
import Control.Monad.IO.Class (MonadIO, liftIO)
import Text.Pandoc.Options
import Text.Pandoc.Shared
import Text.Pandoc.Definition
import Text.Pandoc
import Hakyll

main :: IO ()
main = hakyllWith config $ do
    -- template <- liftIO $ readDataFileUTF8 Nothing "templates/default.epub"
    -- Build tags
    tags <- buildTags "posts/*" (fromCapture "tags/*.html")

    -- Compress CSS
    match "assets/css/*" $ do
        route   $ gsubRoute "assets/" (const "") `composeRoutes` idRoute
        compile compressCssCompiler

    -- Bibtex entries (for bibliography)
    match "assets/bib/*" $ compile biblioCompiler

    match "assets/csl/*" $ compile cslCompiler

    -- Copy static assets
    match "assets/files/*" $ do
        route   idRoute
        compile copyFileCompiler
    
    -- Copy static assets
    match "assets/images/*" $ do
        route   idRoute
        compile copyFileCompiler
        
    -- Copy static assets
    match "assets/font/*" $ do
        route   idRoute
        compile copyFileCompiler

    -- Render posts
    match "posts/*" $ do
        route   $ setExtension ".html"
	compile $ do
	  item <- getUnderlying
	  bibFile <- liftM (fromMaybe "") $ getMetadataField item "biblio"
	  cslFile <- liftM (fromMaybe "chicago") $ getMetadataField item "csl"
	  let compiler = if bibFile /= "" then
		bibtexCompiler cslFile bibFile
		else	pandocCompilerWith defaultHakyllReaderOptions pandocOptions
	  compiler
            >>= loadAndApplyTemplate "templates/post.html" (tagsCtx tags)
            >>= saveSnapshot "content"
            >>= pageCompiler

    match "posts/*" $ version "toc" $
       compile $ pandocCompilerWith defaultHakyllReaderOptions
                                    defaultHakyllWriterOptions {
                                        writerTableOfContents = True
                                      , writerTemplate = "$toc$"
                                      , writerStandalone = True
                                      , writerHTMLMathMethod = MathJax ""
                                      }
    match "posts/*" $ version "epub" $ do
        route $ setExtension "epub"
        compile $ do
        body <- getResourceBody
        withItemBody
            (\p -> unsafeCompiler $ writeEPUB (defaultHakyllWriterOptions )  p)
                    (readPandoc body)

    -- Render posts list
    create ["archive.html"] $ do
        route idRoute
        compile $ do
            posts <- recentFirst =<< loadAll ("posts/*" .&&. hasNoVersion)
            itemTpl <- loadBody "templates/archive-item.html"
            list <- applyTemplateList itemTpl postCtx posts
            let archiveCtx = constField "title" "Todos os posts" `mappend`
                             defaultContext
            makeItem list
                >>= loadAndApplyTemplate "templates/archive.html" (mconcat[mathCtx,archiveCtx])
                >>= pageCompiler

    -- Static pages
    match "pages/*" $ do
        route $ gsubRoute "pages/" (const "") `composeRoutes` setExtension "html"
        compile $ do
            item <- getUnderlying
            title <- liftM (fromMaybe "Posts Relacionados") $ getMetadataField item "relatedTitle"
            related <- liftM (fromMaybe "") $ getMetadataField item "related"
            bibFile <- liftM (fromMaybe "") $ getMetadataField item "biblio"
            cslFile <- liftM (fromMaybe "chicago") $ getMetadataField item "csl"
            list <- if related == "*" then
                        postList "" tags ("posts/*" .&&. hasNoVersion) recentFirst
                    else let items = fromMaybe [] $ Prelude.lookup related (tagsMap tags)
                         in postList "" tags (fromList items) recentFirst
            let relatedCtx = if list == [] then
				constField "related.title" "" `mappend`
				constField "related" list `mappend`
				defaultContext
			     else
				constField "related.title" title `mappend`
				constField "related" list `mappend`
				defaultContext
            let compiler = if bibFile /= "" then
                                bibtexCompiler cslFile bibFile
                           else pandocCompilerWith defaultHakyllReaderOptions pandocOptions
            compiler
                >>= loadAndApplyTemplate "templates/related.html" relatedCtx
                >>= pageCompiler


    -- Project pages
    match "projects/**.md" $ do
        route $ setExtension ".html"
        compile $ pandocCompilerWith defaultHakyllReaderOptions pandocOptions >>= pageCompiler

    match ("projects/**" .&&. complement "projects/**.md") $ do
        route   idRoute
        compile copyFileCompiler

    -- Post tags
    tagsRules tags $ \tag pattern -> do
        let title = "Posts com tag " ++ tag
        let back = "../"
        route idRoute
        compile $ do
            list <- postList back tags pattern recentFirst
            makeItem ""
                >>= loadAndApplyTemplate "templates/archive.html" (
                        mconcat [ constField "title" title
                                , constField "body" list
                                , defaultContext
                                ])
                >>= pageCompiler

    -- Render RSS feed
    create ["rss.xml"] $ do
        route idRoute
        compile $ loadAllSnapshots ("posts/*" .&&. hasNoVersion) "content"
            >>= fmap (take 10) . recentFirst
            >>= renderRss feedConfiguration feedCtx

    create ["atom.xml"] $ do
        route idRoute
        compile $ loadAllSnapshots ("posts/*" .&&. hasNoVersion) "content"
            >>= fmap (take 10) . recentFirst
            >>= renderAtom feedConfiguration feedCtx

    create ["sitemap.xml"] $ do
        route idRoute
        compile $ do
            posts <- loadAll (("pages/*" .||. "posts/*" .||. "projects/**.md")
                              .&&. hasNoVersion)
            itemTpl <- loadBody "templates/sitemap-item.xml"
            list <- applyTemplateList itemTpl (sitemapCtx feedConfiguration) posts
            makeItem list
                >>= loadAndApplyTemplate "templates/sitemap.xml" defaultContext

    match "assets/txt/*" $ do
        route $ gsubRoute "assets/txt/" (const "")
        compile copyFileCompiler

    -- Read templates
    match "templates/*" $ compile templateCompiler

-- Auxiliary compilers
pageCompiler :: Item String -> Compiler (Item String)
pageCompiler i = loadAndApplyTemplate "templates/default.html" (mathCtx `mappend` defaultContext) i
               >>= relativizeUrls

bibtexCompiler :: String -> String -> Compiler (Item String)
bibtexCompiler cslFileName bibFileName = do 
    csl <- load (fromFilePath $ "assets/csl/"++cslFileName)
    bib <- load (fromFilePath $ "assets/bib/"++bibFileName)
    liftM (writePandocWith pandocOptions)
        (getResourceBody >>= readPandocBiblio def csl bib)

postList :: String -> Tags -> Pattern -> ([Item String] -> Compiler [Item String])
         -> Compiler String
postList back tags pattern preprocess' = do
    postItemTpl <- loadBody "templates/archive-item.html"
    posts <- preprocess' =<< loadAll (pattern .&&. hasNoVersion)
    applyTemplateList postItemTpl (mconcat[constField "back" back,tagsCtx tags]) posts


mathjax :: Item String -> Compiler String
mathjax item = do
    metadata <- getMetadata (itemIdentifier item)
    return $ case Data.Map.lookup "math" metadata of
        Just "true" -> "<script type=\"text/javascript\" src=\"http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML\" />"
        otherwise   -> ""
        
-- Contexts
postCtx :: Context String
postCtx = mconcat [ dateField "date.machine" (iso8601DateFormat Nothing)
                  , dateField "date" "%e-%b-%Y"
                  , field "toc" $ \item ->
                        loadBody ((itemIdentifier item) { identifierVersion = Just "toc"})
                  , modificationTimeField "updated.machine" (iso8601DateFormat Nothing)
                  , modificationTimeField "updated" "%B %e, %Y"
                  , dateField "date.day" "%d"
                  , dateField "date.month" "%b"
                  , dateField "date.year" "%Y"
                  , constField "back" ""
                  , defaultContext
                  ]

mathCtx :: Context String
mathCtx = mconcat
         [field "mathjax" mathjax
         ]

                  
feedCtx :: Context String
feedCtx = mconcat [ postCtx
                  , metadataField
                  ]

tagsCtx :: Tags -> Context String
tagsCtx tags = mconcat [ tagsField "prettytags" tags
                       , postCtx
                       ]

sitemapCtx :: FeedConfiguration -> Context String
sitemapCtx conf = mconcat [ constField "root" (feedRoot conf)
                          , feedCtx
                          ]

-- Configuration
config :: Configuration
config = defaultConfiguration {
    deployCommand = " rsync --checksum --delete -ave 'ssh' \
                    \_site/* acmt@pizza.ime.usp.br:www/hakyll"
    }

feedConfiguration :: FeedConfiguration
feedConfiguration = FeedConfiguration
    { feedTitle = "Anderson Tavares - RSS feed"
    , feedDescription = "Publicações, Pesquisas, Materiais..."
    , feedAuthorName = "Anderson Tavares"
    , feedAuthorEmail = "acmt@ime.usp.br"
    , feedRoot = "http://vision.ime.usp.br/~acmt/hakyll"
    }
pandocOptions :: WriterOptions
pandocOptions = defaultHakyllWriterOptions
   { writerHTMLMathMethod = MathJax ""
   }
