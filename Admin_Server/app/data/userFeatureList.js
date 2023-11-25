var path = require('path');
var featureList = require(path.join(__dirname, 'featureList'));

var defaultTeacherRoleFeatures =     
 [{ feature: featureList.availableFeatures().WriteContent, hasAccess: true },
  
];

exports.defaultAutherRoleFeatures = defaultTeacherRoleFeatures;
