# NetSuite User Access Inspection Script (Updated May 2025)

This repository contains an optimized SuiteScript 2.0 script for inspecting user access controls in Oracle NetSuite. The script logs each user's internal ID, email, role name, and role ID to the Execution Log with improved memory management and error handling. This is an updated version of the original script with significant performance and functionality enhancements.

- [Project Description](#project-description)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Deployment](#deployment)
- [Script](#script)
- [Key Features](#key-features)
- [Compatibility](#compatibility)
- [Contributing](#contributing)
- [References](#references)
- [License](#license)

## Project Description

This script provides an efficient way to inspect user access controls in NetSuite. It queries for active users in the system and logs relevant access details (user's internal ID, email, role name, and role ID) to the Execution Log. The script includes optimizations for memory management, better error handling, and improved logging for monitoring execution progress.

### Update History
- **May 2025**: Major update with improved memory management, added role ID capture, enhanced error handling with stack traces, optimized pagination, and better progress logging.

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

Below is the optimized SuiteScript 2.0 script (updated May 2025):

```javascript
/**
 *@NApiVersion 2.x
 *@NScriptType ScheduledScript
 */
define(['N/search', 'N/log'], function(search, log) {
  function execute() {  // Removed unused context parameter
    try {
      // Create a search for active employees
      var userSearch = search.create({
        type: search.Type.EMPLOYEE,
        filters: [
          search.createFilter({
            name: 'isinactive',
            operator: search.Operator.IS,
            values: ['F']
          })
          // You can add additional filters here if needed to limit results
          // Example: search.createFilter({name: 'supervisor', operator: search.Operator.ANYOF, values: [123]})
        ],
        columns: [
          search.createColumn({ name: 'internalid' }),
          search.createColumn({ name: 'email' }),
          search.createColumn({ name: 'role' })
        ]
      });

      // Reduce the page size for better performance and to avoid governance issues
      var pagedData = userSearch.runPaged({pageSize: 100});
      var totalPages = pagedData.pageRanges.length;
      log.audit({
        title: 'Processing Employee Records', 
        details: 'Total pages to process: ' + totalPages
      });
      
      // Iterate over the page ranges
      pagedData.pageRanges.forEach(function(pageRange) {
        // Fetch each page of results
        var myPage = pagedData.fetch({index: pageRange.index});
        var logMessages = [];  // Reset array for each page to manage memory better
        
        // Iterate over each result in the page
        myPage.data.forEach(function(result) {
          // Get the values of the internalid, email, and role fields for each result
          var internalId = result.getValue({ name: 'internalid' });
          var email = result.getValue({ name: 'email' });
          var roleText = result.getText({ name: 'role' });
          var roleId = result.getValue({ name: 'role' });  // Also get the role ID
          
          // Add the details of each user to the logMessages array
          logMessages.push({
            'User ID': internalId,
            'Email': email,
            'Role': roleText,
            'Role ID': roleId
          });
        });
        
        // Log the details of users in this page
        log.debug({
          title: 'User Access Info - Page ' + (pageRange.index + 1) + ' of ' + totalPages,
          details: JSON.stringify(logMessages)
        });
      });
      
      log.audit({
        title: 'Employee Search Complete',
        details: 'Successfully processed all pages'
      });
      
    } catch (error) {
      log.error({
        title: 'Error running employee search',
        details: error.message + '\n' + error.stack  // Add stack trace for better debugging
      });
    }
  }
  
  return {
    execute: execute
  };
});
```

[Back to Top](#netsuite-user-access-inspection-script)

## Key Features

The script includes several optimizations and enhancements:

1. **Improved Memory Management**: Processes and logs data page by page instead of storing all results in memory.
2. **Enhanced Role Information**: Captures both the role display name and internal ID for more complete information.
3. **Optimized Pagination**: Uses a smaller page size (100 records per page) to help avoid governance limits.
4. **Advanced Logging**: Includes audit logs for tracking script progress and per-page logging for better organization.
5. **Robust Error Handling**: Enhanced error logging with stack traces for easier troubleshooting.
6. **Extensibility**: Includes comments for adding additional filters when needed.

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

## License

This project is licensed under the MIT License. See the [LICENSE](License.txt) file for details.

[Back to Top](#netsuite-user-access-inspection-script)