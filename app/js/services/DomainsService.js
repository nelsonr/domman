app.factory('DomainsService', function(FileService) {
	var	list = [],
		service = {};

	service.load = function() {
		var ap = require('apache-vhosts-parser');

		list = ap.parse(config.vhosts_file);
	};

	service.list = function() {
		return list;
	};

	service.getLastId = function() {
		return list[list.length - 1]['id'];
	};

	service.add = function(domain) {
		var id = list.length > 0 ? service.getLastId() + 1 : 0;
		list.push({id: id, ServerName: domain.ServerName, DocumentRoot: domain.DocumentRoot});

		addVhost(domain);
		addHost(domain.ServerName);

		return id;
	};

	service.update = function(domain) {
		var currentDomain = service.get(domain.id);

		if(currentDomain !== domain) {
			editVhost(currentDomain, domain);

			if(currentDomain.ServerName !== domain.ServerName) {
				editHost(currentDomain.ServerName, domain.ServerName);
			}
		}

		list = list.map(function(el) {
			if(el.id === domain.id) el = domain;

			return el;
		});

		return true;
	};

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

	service.get = function(id) {
		var i = 0, length = list.length;

		for(; i < length; i++) {
			if(list[i]['id'] === parseInt(id)) {
				return list[i];
			}
		}

		return false;
	};

	if(list.length == 0) {
		// initialize list
		service.load();
	}

	function addVhost(domain) {
		var vhost = "\n\n<VirtualHost *>\n";
		var attrVal = '';

		for(attr in domain) {
			attrVal = domain[attr];

			if(attr === 'DocumentRoot' && attr.indexOf('"') == -1) {
				attrVal = '"' + attrVal + '"';
			}

			vhost += "\t" + attr + ' ' + attrVal + "\n";
		}

		vhost += "</VirtualHost>";

		FileService.append(config.vhosts_file, vhost);
	}

	function editVhost(currentDomain, domain) {
		var vhostsFile = FileService.read(config.vhosts_file);

		vhostsFile = vhostsFile.replace(currentDomain.ServerName, domain.ServerName);
		vhostsFile = vhostsFile.replace(currentDomain.DocumentRoot, domain.DocumentRoot);

		FileService.write(config.vhosts_file, vhostsFile);
	}

	function deleteVhost(domain) {
		var vhostsFile = FileService.read(config.vhosts_file);
		var domainRegex = new RegExp('<VirtualHost \\*>[\\s\\w]*' + domain.ServerName + '[\\s\\S]*?<\\/VirtualHost>');

		// remove domain
		vhostsFile = vhostsFile.replace(domainRegex, '');

		// tidy vhost file
		vhostsFile = vhostsFile.replace('\n\n\n', '\n').trim();

		FileService.write(config.vhosts_file, vhostsFile);
	}

	function addHost(domainName) {
		if(domainName) {
			FileService.append(config.win_hosts_file, "\r" + "127.0.0.1 " + domainName);

			return true;
		}

		return false;
	}

	function editHost(currentDomainName, domainName) {
		var hostsFile = FileService.read(config.win_hosts_file);
		hostsFile = hostsFile.replace(currentDomainName, domainName);

		FileService.write(config.win_hosts_file, hostsFile);
	}

	function deletHost(domain) {
		var hostsFile = FileService.read(config.win_hosts_file);

		hostsFile = hostsFile.replace('127.0.0.1 ' + domain.ServerName, '').trim()

		FileService.write(config.win_hosts_file, hostsFile);
	}

	return service;
});
