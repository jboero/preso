#!/bin/bash

vault server -dev
vault unseal
vault list /

