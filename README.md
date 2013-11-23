Domman - Virtual Hosts Manager
======

![Edit](http://i.imgur.com/R1BR9hn.png)

## What?

Domman (domain manager) is a virtual hosts manager for local development

## Why?

To simplify the creation and management of Virtual Hosts without having to edit files in different places (and deal with administrator permissions) and restarting Apache everytime.

## Features

These are some of the features of Domman.

- Creation and editing of new and existing Virtual Hosts
- Automatic editing of the httpd-vhosts.conf and hosts files
- Automatic restart of the Apache service
- Automatic detection of the httpd-vhosts.conf file path (XAMPP, WAMP) - **Not implemented yet**

## Platforms

Domman runs on [node-webkit](https://github.com/rogerwang/node-webkit) and the current targeted platform is Windows. Although multi-platform should not be hard to do (famous last words!).

## How to run

Until a build is provided, here's how to run Domman on your machine:

- Download [node-webkit](https://github.com/rogerwang/node-webkit)
- Clone this repository
- Open the **app** folder with node-webkit

**Note**: Please backup your httpd-vhosts.conf and hosts files before running Domman as it's still in development!
