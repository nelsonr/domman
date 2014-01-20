app.factory('HostsService', function(FileService) {
    var service = {};

	/**
	 * Add a domain to the hosts file
	 *
	 * @param domainName
	 * @returns {boolean}
	 */
	service.add = function(domainName) {
		if(domainName) {
			FileService.append(config.win_hosts_file, "\n" + "127.0.0.1 " + domainName);

			return true;
		}

		return false;
	};

	/**
	 * Update a domain in the hosts file
	 *
	 * @param currentDomainName
	 * @param domainName
	 */
	service.edit = function(currentDomainName, domainName) {
		var hostsFile = FileService.read(config.win_hosts_file);
		hostsFile = hostsFile.replace(currentDomainName, domainName);

		FileService.write(config.win_hosts_file, hostsFile);
	};

	/**
	 * Remove a domain from the hosts file
	 *
	 * @param domain
	 */
	service.remove = function(domain) {
		var hostsFile = FileService.read(config.win_hosts_file);

		hostsFile = hostsFile.replace('127.0.0.1 ' + domain.ServerName, '').trim()

		FileService.write(config.win_hosts_file, hostsFile);
	};

	return service;
});
