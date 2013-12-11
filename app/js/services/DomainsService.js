app.factory('DomainsService', function(FileService) {
	var	list = [],
		service = {};

	/**
	 * Parse the httpd-vhosts.conf file and initializes the list
	 */
	service.load = function() {
		var ap = require('apache-vhosts-parser');

		list = ap.parse(config.vhosts_file);
	};

	/**
	 * Get the domains list
	 *
	 * @returns {Array}
	 */
	service.list = function() {
		return list;
	};

	/**
	 * Get the ID of the last domain added
	 *
	 * @returns {number}
	 */
	service.getLastId = function() {
		return list[list.length - 1]['id'];
	};

	/**
	 * Add a new domain
	 *
	 * @param domain
	 * @returns {number|string}
	 */
	service.add = function(domain) {
		var id = list.length > 0 ? service.getLastId() + 1 : 0;
		list.push({id: id, ServerName: domain.ServerName, DocumentRoot: domain.DocumentRoot});

		addVhost(domain);
		addHost(domain.ServerName);

		return id;
	};

	/**
	 * Update domain
	 *
	 * @param domain
	 * @returns {boolean}
	 */
	service.update = function(domain) {
		var currentDomain = service.get(domain.id);

		if(!equal(currentDomain, domain)) {
			editVhost(currentDomain, domain);

			if(currentDomain.ServerName !== domain.ServerName) {
				editHost(currentDomain.ServerName, domain.ServerName);
			}

			// Update domain in the list
			list = list.map(function(el) {
				if(el.id === domain.id) el = domain;

				return el;
			});

			return true;
		}

		return false;
	};

	/**
	 * Remove domain
	 *
	 * @param id
	 * @returns {boolean}
	 */
	service.remove = function(id) {
	    var i = 0, length = list.length;
		var domain = service.get(id);

		for(; i < length; i++) {
			if(list[i]['id'] === id) {
				list.splice(i, 1);
				deleteVhost(domain);
				deletHost(domain);

				return true;
			}
		}

		return false;
	};

	/**
	 * Get a domain by ID
	 *
	 * @param id
	 * @returns {*}
	 */
	service.get = function(id) {
		var i = 0, length = list.length;

		for(; i < length; i++) {
			if(list[i]['id'] === parseInt(id)) {
				return list[i];
			}
		}

		return false;
	};

	/**
	 * Add a new domain to httpd-vhosts.conf
	 *
	 * @param domain
	 */
	function addVhost(domain) {
		var vhost = "\n\n<VirtualHost *>\n";
		var attrVal = '';

		for(attr in domain) {
			attrVal = domain[attr];

			// Ensure that DocumentRoot begins and ends with a double quote
			if(attr === 'DocumentRoot') {
				attrVal = '"' + attrVal.replace(/"/g, '') + '"';
			}

			vhost += "\t" + attr + ' ' + attrVal + "\n";
		}

		vhost += "</VirtualHost>";

		FileService.append(config.vhosts_file, vhost);
	}

	/**
	 * Update a domain in httpd-vhosts.conf
	 *
	 * @param currentDomain
	 * @param domain
	 */
	function editVhost(currentDomain, domain) {
		var vhostsFile = FileService.read(config.vhosts_file);

		vhostsFile = vhostsFile.replace(currentDomain.ServerName, domain.ServerName);
		vhostsFile = vhostsFile.replace(currentDomain.DocumentRoot, domain.DocumentRoot);

		FileService.write(config.vhosts_file, vhostsFile);
	}

	/**
	 * Remove a domain from httpd-vhosts.conf
	 *
	 * @param domain
	 */
	function deleteVhost(domain) {
		var vhostsFile = FileService.read(config.vhosts_file);
		var domainRegex = new RegExp('<VirtualHost \\*>[\\s\\w]*' + domain.ServerName + '[\\s\\S]*?<\\/VirtualHost>');

		// remove domain
		vhostsFile = vhostsFile.replace(domainRegex, '');

		// tidy vhost file
		vhostsFile = vhostsFile.replace('\n\n\n', '\n').trim();

		FileService.write(config.vhosts_file, vhostsFile);
	}

	/**
	 * Add a domain to the hosts file
	 *
	 * @param domainName
	 * @returns {boolean}
	 */
	function addHost(domainName) {
		if(domainName) {
			FileService.append(config.win_hosts_file, "\n" + "127.0.0.1 " + domainName);

			return true;
		}

		return false;
	}

	/**
	 * Update a domain in the hosts file
	 *
	 * @param currentDomainName
	 * @param domainName
	 */
	function editHost(currentDomainName, domainName) {
		var hostsFile = FileService.read(config.win_hosts_file);
		hostsFile = hostsFile.replace(currentDomainName, domainName);

		FileService.write(config.win_hosts_file, hostsFile);
	}

	/**
	 * Remove a domain from the hosts file
	 *
	 * @param domain
	 */
	function deletHost(domain) {
		var hostsFile = FileService.read(config.win_hosts_file);

		hostsFile = hostsFile.replace('127.0.0.1 ' + domain.ServerName, '').trim()

		FileService.write(config.win_hosts_file, hostsFile);
	}

	// Initialize list if empty
	if(list.length == 0) {
		service.load();
	}

	return service;
});
