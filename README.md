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
 *@NApiVersion 2.x  // Specifies the SuiteScript API version being used
 *@NScriptType ScheduledScript  // Specifies the type of script
 */
define(['N/search', 'N/log'], function(search, log) {  // Includes necessary SuiteScript modules
  function execute(context) {  // The primary function that is called when the script is executed
    try {
      // Create a search for active employees
      var userSearch = search.create({
        type: search.Type.EMPLOYEE,  // Specifies the record type to search
        filters: [  // Defines search filters
          search.createFilter({
            name: 'isinactive',
            operator: search.Operator.IS,
            values: ['F']  // Searching for active employees
          })
        ],
        columns: [  // Specifies the columns to be returned in the search results
          search.createColumn({ name: 'internalid' }),
          search.createColumn({ name: 'email' }),
          search.createColumn({ name: 'role' })
        ]
      });

      var logMessages = [];  // Initializes an array to hold the log messages

      // Execute the search and iterate over the results using pagination
      var pagedData = userSearch.runPaged({pageSize: 1000});

      // Iterate over the page ranges
      pagedData.pageRanges.forEach(function(pageRange) {
        // Fetch each page of results
        var myPage = pagedData.fetch({index: pageRange.index});

        // Iterate over each result in the page
        myPage.data.forEach(function(result) {
          // Get the values of the internalid, email, and role fields for each result
          var internalId = result.getValue({ name: 'internalid' });
          var email = result.getValue({ name: 'email' });
          var role = result.getText({ name: 'role' });

          // Add the details of each user to the logMessages array
          logMessages.push({
            'User ID': internalId,
            'Email': email,
            'Role': role
          });
        });
      });

      // Log the details of all users as a JSON string
      log.debug({
        title: 'User Access Info',
        details: JSON.stringify(logMessages)
      });
    } catch (error) {  // Catch and log any errors that occur during the execution of the script
      log.error({
        title: 'Error running employee search',
        details: error
      });
    }
  }

  return {
    execute: execute  // This makes the execute function publicly available so it can be run by NetSuite
  };
});
```

[Back to Top](#netsuite-user-access-inspection-script)

## Compatibility

This script is designed for use with Oracle NetSuite ERP. It has been tested on NetSuite 2021.2 but should work on any version that supports SuiteScript 2.0. While it's expected to work on later versions as well, if you encounter any issues, please report them in the [issues section](#contributing) of this repository.

If you're unsure about the version of NetSuite you're using, you can check it by navigating to Home > Set Preferences > General > Defaults in your NetSuite account.

Bear in mind that Oracle might, from time to time, incorporate changes that can cause disruptions in the course of major version updates. As such, it's essential to thoroughly validate scripts like these within a secure and isolated 'sandbox' environment prior to their deployment in a production setting.

[Back to Top](#netsuite-user-access-inspection-script)

## Contributing

Your pull requests are highly appreciated. Yet, for more significant modifications, I'd kindly ask you to initiate a conversation by opening an issue first. This way, we can collaborate in discussing your proposed changes and their potential impact.

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
