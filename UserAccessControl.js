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