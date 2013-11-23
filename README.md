domman (domain manager)
======

![Edit](http://i.imgur.com/R1BR9hn.png)

The goal is to create an utility to manage Virtual Hosts for Apache in local development.

This utility aims to simplify the creation and editing of Virtual Hosts without having to go around 3 different places to do so.

As so the features that I want to achieve are:

- Creation and editing of new and existing Virtual Hosts
- Automatic editing of the httpd-vhosts.conf and hosts files
- Automatic restart of the Apache service
- Automatic detecting of the httpd-vhosts.conf file path (XAMPP, WAMP, or any other flavor that might exist)

The application uses node-webkit and the current targeted platform is Windows, cross-platform might be considered in the future.
