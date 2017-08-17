#!/usr/bin/env bash
set -ex
redis-cli -p 80 save
