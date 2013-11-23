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

		addVHostsFile(domain);
		addHostsFile(domain.ServerName);

		return id;
	};

	service.update = function(domain) {
		var currentDomain = service.get(domain.id);

		if(currentDomain !== domain) {
			editVHostsFile(currentDomain, domain);

			if(currentDomain.ServerName !== domain.ServerName) {
				editHostsFile(currentDomain.ServerName, domain.ServerName);
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
				deleteVHostsFile(domain);
				deleteHostsFile(domain);

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

	function addVHostsFile(domain) {
		var vhost = "\n<VirtualHost *>\n";
		var attrVal = '';

		for(attr in domain) {
			attrVal = domain[attr];

			if(attr === 'DocumentRoot' && attr.indexOf('"') == -1) {
				attrVal = '"' + attrVal + '"';
			}

			vhost += "\t" + attr + ' ' + attrVal + "\n";
		}

		vhost += "</VirtualHost>\n";

		FileService.append(config.vhosts_file, vhost);
	}

	function editVHostsFile(currentDomain, domain) {
		var vhostsFile = FileService.read(config.vhosts_file);
		var editedVHostsFile;

		editedVHostsFile = vhostsFile.replace(currentDomain.ServerName, domain.ServerName);
		editedVHostsFile = editedVHostsFile.replace(currentDomain.DocumentRoot, domain.DocumentRoot);

		FileService.write(config.vhosts_file, editedVHostsFile);
	}

	function deleteVHostsFile(domain) {
		var vhostsFile = FileService.read(config.vhosts_file);
		var domainRegex = new RegExp('<VirtualHost \\*>[\\s\\w]*' + domain.ServerName + '[\\s\\S]*?<\\/VirtualHost>');

		// remove domain
		vhostsFile = vhostsFile.replace(domainRegex, '');

		// tidy vhost file
		vhostsFile = vhostsFile.replace('\n\n\n', '\n').trim();

		FileService.write(config.vhosts_file, vhostsFile);
	}

	function addHostsFile(domainName) {
		if(domainName) {
			FileService.append(config.win_hosts_file, "\r" + "127.0.0.1 " + domainName);

			return true;
		}

		return false;
	}

	function editHostsFile(currentDomainName, domainName) {
		var hostsFile = FileService.read(config.win_hosts_file);
		var editedHosts = hostsFile.replace(currentDomainName, domainName);

		FileService.write(config.win_hosts_file, editedHosts);
	}

	function deleteHostsFile(domain) {
		var hostsFile = FileService.read(config.win_hosts_file);

		FileService.write(config.win_hosts_file, hostsFile.replace('127.0.0.1 ' + domain.ServerName, '').trim());
	}

	return service;
});
