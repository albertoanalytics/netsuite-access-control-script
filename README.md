# NetSuite User Access Inspection Script

This repository contains a SuiteScript 2.0 script for inspecting user access controls in Oracle NetSuite. The script logs each user's internal ID, email, and role to the Execution Log.

- [Project Description](#project-description)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Deployment](#deployment)
- [Script](#script)
- [Compatibility](#compatibility)
- [Contributing](#contributing)
- [References](#references)
- [Contact](#contact)
- [License](#license)

## Project Description

This script provides an easy way to inspect user access controls in NetSuite. It queries for active users in the system and logs relevant access details (user's internal ID, email, and role) to the Execution Log.

[Back to Top](#netsuite-user-access-inspection-script)

## Getting Started

### Prerequisites

To use this script, you should have:

- Access to an Oracle NetSuite instance
- Permission to create and deploy SuiteScripts

### Installation

1. Create a new SuiteScript file in your NetSuite File Cabinet. Name it "UserAccessControl.js" or something similar.
2. Copy the content of the `UserAccessControl.js` file from this repository into the SuiteScript file you just created in NetSuite.

[Back to Top](#netsuite-user-access-inspection-script)

## Deployment

1. In NetSuite, navigate to Customization > Scripting > Scripts > New.
2. Create a new script record and set the script type to "Scheduled". Attach the SuiteScript file you created earlier.
3. After saving the script record, deploy the script.
4. You can schedule the script to run as needed or manually execute it to inspect user access control.

[Back to Top](#netsuite-user-access-inspection-script)

## Script

Below is the SuiteScript 2.0 script:

```javascript
/**
 *@NApiVersion 2.x
 *@NScriptType ScheduledScript
 */
define(['N/search', 'N/log'], function(search, log) {
  function execute(context) {
    var userSearch = search.create({
      type: search.Type.EMPLOYEE,
      filters: [
        search.createFilter({
          name: 'isinactive',
          operator: search.Operator.IS,
          values: ['F']
        })
      ],
      columns: [
        search.createColumn({ name: 'internalid' }),
        search.createColumn({ name: 'email' }),
        search.createColumn({ name: 'role' })
      ]
    });

    userSearch.run().each(function(result) {
      var internalId = result.getValue({ name: 'internalid' });
      var email = result.getValue({ name: 'email' });
      var role = result.getText({ name: 'role' });

      log.debug({
        title: 'User Access Info',
        details: 'User ID: ' + internalId + ', Email: ' + email + ', Role: ' + role
      });

      return true;
    });
  }

  return {
    execute: execute
  };
});
```

[Back to Top](#netsuite-user-access-inspection-script)

## Compatibility

This script is designed for use with Oracle NetSuite ERP. It has been tested on NetSuite 2021.2 but should work on any version that supports SuiteScript 2.0. While it's expected to work on later versions as well, if you encounter any issues, please report them in the [issues section](#contributing) of this repository.

If you're unsure about the version

 of NetSuite you're using, you can check it by navigating to Home > Set Preferences > General > Defaults in your NetSuite account.

Please note that Oracle occasionally introduces breaking changes in major version updates. Always test scripts like these in a sandbox environment before deploying them in a production environment.

[Back to Top](#netsuite-user-access-inspection-script)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

[Back to Top](#netsuite-user-access-inspection-script)

## References

- [NetSuite SuiteScript 2.0 API](https://www.netsuite.com/portal/developers/resources/apis/suitescript2.shtml)

[Back to Top](#netsuite-user-access-inspection-script)

## Contact

For any questions or issues related to this script, please contact the repository owner:

- Name: Alberto F. Hernandez
- Email: ah8664383@gmail.com
- Linkedin: https://www.linkedin.com/in/albertoscode/

Please make sure to reference this script or project in your communication.

[Back to Top](#netsuite-user-access-inspection-script)

## License

This project is licensed under the MIT License. See the [LICENSE](License.txt) file for details.

[Back to Top](#netsuite-user-access-inspection-script)
