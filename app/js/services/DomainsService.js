app.factory('DomainsService', function(VHostsService, HostsService) {
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
		VHostsService.add(domain);
		HostsService.add(domain.ServerName);

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
			VHostsService.edit(currentDomain, domain);

			if(currentDomain.ServerName !== domain.ServerName) {
				HostsService.edit(currentDomain.ServerName, domain.ServerName);
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
				VHostsService.remove(domain);
				HostsService.remove(domain);

				return true;
			}
		}

		return false;
	};

	// Initialize list if empty
	if(list.length == 0) {
		service.load();
	}

	return service;
});
