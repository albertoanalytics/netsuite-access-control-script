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