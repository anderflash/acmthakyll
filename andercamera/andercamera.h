#ifndef ANDERCAMERA_H
#define ANDERCAMERA_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <assert.h>

#include <getopt.h>             /* getopt_long() */

#include <fcntl.h>              /* low-level i/o */
#include <unistd.h>
#include <errno.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <sys/time.h>
#include <sys/mman.h>
#include <sys/ioctl.h>

#include <linux/videodev2.h>

#define CLEAR(x) memset(&(x), 0, sizeof(x))

enum io_method
{
	IO_METHOD_READ,
	IO_METHOD_MMAP,
	IO_METHOD_USERPTR
};

struct buffer
{
	void *start;
	size_t length;
};

struct Camera
{
	enum          io_method io;
  int           out_buf;
	struct buffer *buffers;
	unsigned int  n_buffers;
	int           force_format;
	int           frame_count;
	int           fd;
  char*         dev_name;
};

typedef struct Camera Camera;

char *dev_name;

static void ANDERopen_device(Camera* camera);
static void ANDERclose_device(Camera* camera);
static void ANDERinit_device(Camera* camera);
static void ANDERstart_capturing(Camera* camera);
static void ANDERstop_capturing(Camera* camera);
static int ANDERread_frame(Camera* camera, void**p, int* size);
static void ANDERuninit_device(Camera* camera);

#endif
