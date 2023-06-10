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