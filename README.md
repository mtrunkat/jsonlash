jsonlash
========

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/jsonlash.svg)](https://npmjs.org/package/jsonlash)

CLI utility for filtering and aggregation of [JSONL](http://jsonlines.org/) streams. No matter which service for logging you use (LogDNA, Papertrail, Loggly, etc.) simply pipe log into **jsonlash** set up filters and aggregators and see aggregated data in realtime.

## Usage

### Installation

Install from [NPM](http://npmjs.com) globally:

```bash
npm install -g jsonlash
```

After installation you can simply run jsonlash from your terminal with `-h` parameter to display help page:

```bash
jsonlash -h
```

### Basic usage with filtering

We currently use [Log DNA](https://logdna.com/) as logging service so I am going to use it in examples but it's going to work with any [JSONL](http://jsonlines.org/) stream. So pipe your log stream to jsonlash:

```bash
logdna tail | jsonlash
```

Now it will simply print out the log as it comes. So let's filter the API logs that are in the form:

```
{
    "msg": "API call",
    "req": {
        "duration": 590,
        "method": "GET",
        "route": "V2.datasets.items",
        ...
    }
    ...
}
```

Filtering is done using `-f [FILTER]` parameter:

```bash
logdna tail | jsonlash -f 'msg=API call'
```

We can add more filters to filter out only requests with POST method and duration over 1000ms. And also add parameter `-e` to expand printed JSONs to be more readable:

```bash
logdna tail | jsonlash -f 'msg=API call' -f 'req.method=POST' -f 'req.duration>1000' -e
```

### Aggregations

Let's continue with API logs example. To group log lines by request method and compute average and maximal duration call:

```bash
logdna tail | jsonlash -f 'msg=API call' -a req.method --max req.duration --avg req.duration
```

and output will be a table with data aggregated in realtime:

<div align="center">
    <img src="https://uc90d6b2f1095fdef187f2d0230d.previews.dropboxusercontent.com/p/orig/AANd1RKoGxAcGEkhWG_dY0JTl927e5STzencbkAfzAC5zvxrx9HH76iTZLib8fCyqCM2qWDBmlaYVHU93ETBmoVJhWK_-t9DccVvCCTYA5pqoaipZ68MzJRfAeYsiFyAZ5uetQVEZ7qpqyzQy2jo3i_9XmIviz0sYp7QbKUPK_OYOjH9CKgCIYWlXTSww7wgzY86P_vckZDrXXBMgBy6TrQf/p.gif?size=1280x960&size_mode=3" />
</div>

## Examples

### 1.

Aggregate logs by two fields `req.method` and `req.routeName` and compute average duration and the maximum duration

```bash

... | jsonlash -a req.method -a req.routeName --max req.duration --avg req.duration

```

### 2.

Filter out requests taking more than a 10s, grouped them by `req.routeName` and compute how many users requested each of them:

```bash
... | jsonlash -f 'req.duration>10000' -a req.routeName --uni req.userId
```

## Command reference

```
This is a simple command line tool to filter and aggregate JSONL (json-lines) streams.

USAGE
  $ jsonlash

OPTIONS
  -a, --aggregate=aggregate  aggregate JSONL items
  -d, --debug                debug mode, shows JSON parsing errors
  -e, --expand               expand outputted JSON
  -f, --filter=filter        filter JSONL items
  -h, --help                 show CLI help

  -v, --version              show CLI version
  --avg=avg                  aggregate average value over all occurrences of given field
  --max=max                  aggregate maximum value over all occurrences of given field
  --min=min                  aggregate minimum value over all occurrences of given field
  --sum=sum                  aggregate sum over all occurrences of given field
  --uni=uni                  aggregate number of unique occurrences of given field

DESCRIPTION
  Simply pipe in any JSONL stream and with filter and/or aggregation flag.

  If you use only --filter then jsonlash outputs filtered jsonl stream.

  If you use --aggregate command then it renders a table with aggregated data.
  Additionally you may add one or more --min|--max|--sum|---avg|--uni to compute aggregated values of some fields
```
