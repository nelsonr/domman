app.factory('VHostsService', function(FileService) {
	var service = {};

	/**
	 * Add a new domain to httpd-vhosts.conf
	 *
	 * @param domain
	 */
	service.add = function(domain) {
		var attrVal, vhost = "\n\n<VirtualHost *>\n";

		for(attr in domain) {
			attrVal = domain[attr];

			if(attr === 'DocumentRoot') {
				// Trailing backslash '\' breaks DocumentRoot
				attrVal = attrVal.replace(/\\$/, '');

				// Ensure that DocumentRoot begins and ends with a double quote
				attrVal = '"' + attrVal.replace(/"/g, '') + '"';
			}

			vhost += "\t" + attr + ' ' + attrVal + "\n";
		}

		vhost += "</VirtualHost>";

		FileService.append(config.vhosts_file, vhost);
	};

	/**
	 * Update a domain in httpd-vhosts.conf
	 *
	 * @param currentDomain
	 * @param domain
	 */
	service.edit = function(currentDomain, domain) {
		var vhostsFile = FileService.read(config.vhosts_file);

		// Trailing backslash '\' breaks DocumentRoot
		domain.DocumentRoot = domain.DocumentRoot.replace(/\\$/, '');

		vhostsFile = vhostsFile.replace(currentDomain.ServerName,
										domain.ServerName);

		// TODO: fix this bug
		// If two domains share the same DocumentRoot and one is changed
		// it replaces the first instance of the DocumentRoot string in
		// the file and maybe not the one intended
		vhostsFile = vhostsFile.replace(currentDomain.DocumentRoot,
										domain.DocumentRoot);

		FileService.write(config.vhosts_file, vhostsFile);
	};

	/**
	 * Remove a domain from httpd-vhosts.conf
	 *
	 * @param domain
	 */
	service.remove = function(domain) {
		var vhostsFile = FileService.read(config.vhosts_file);
		var domainRegex = new RegExp(
			'<VirtualHost \\*>[\\s\\w]*'
			+ domain.ServerName
			+ '[\\s\\S]*?<\\/VirtualHost>'
		);

		// remove domain
		vhostsFile = vhostsFile.replace(domainRegex, '');

		// tidy vhost file
		vhostsFile = vhostsFile.replace('\n\n\n', '\n').trim();

		FileService.write(config.vhosts_file, vhostsFile);
	};

	return service;
});
