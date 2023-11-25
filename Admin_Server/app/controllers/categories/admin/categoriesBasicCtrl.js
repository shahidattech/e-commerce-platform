var restify = require('restify');
var productModel = require('mongoose').model('Product');
const fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, '..', 'category.xlsx');

var fileJson = path.join(__dirname, '..', 'category.json');
const rawdata = fs.readFileSync(path.join(__dirname, '..', 'category.json'));
const readXlsxFile = require('read-excel-file/node');

exports.getCategories = (req, res, next) => {
    fs.readFile(fileJson, (err, data) => {
        if (err) throw err;
        let student = JSON.parse(data);
        // console.log(student);
        res.status(200);
        res.send({ data: student });

    });
};

function grouping(items) {
    var catHash = {},
        catList = [],
        i = 0;

    for (i = 0; i < items.length; i++) {
        console.log("aaa");
        console.log(items[i]);

        for (j = 0; j < items[i].length; j++) {
            console.log(items[i][j]);
        }


        var hash = catHash[items[i]["id"]] || {};
        hash.groupHash = hash.groupHash || {};

        var groupHash = hash.groupHash[items[i]["category"]] || {};
        groupHash.subgroupHash = groupHash.subgroupHash || {};

        var subgroupHash = groupHash.subgroupHash[items[i]["sub-cat"]] || {},
            cat = hash.category || {},
            group = groupHash.group || {},
            subgroup = subgroupHash.subgroup || {};

        if (!cat.id) {
            cat.id = items[i]["id"];
            catList.push(cat);
            hash.category = cat;
            catHash[cat.id] = hash;
        }
        // if (!cat.name) {
        //     cat.name = items[i]["desc cat"];
        // }
        if (!cat.group) {
            cat.group = [];
        }
        if (!group.id) {
            group.id = items[i]["category"];
            cat.group.push(group);

            groupHash.group = group;
            hash.groupHash[group.id] = groupHash;
        }
        // if (!group.name) {
        //     group.name = items[i]["desc gr"];
        // }
        if (!group.subgroup) {
            group.subgroup = [];
        }
        if (!subgroup.id) {
            subgroup.id = items[i]["sub-cat"];
            group.subgroup.push(subgroup);

            subgroupHash.subgroup = subgroup;
            groupHash.subgroupHash[subgroup.id] = subgroupHash;
        }
        // if (!subgroup.name) {
        //     subgroup.name = items[i]["desc sub"];
        // }
    }
    return catList;
}

exports.getCatSubCatSubSub = function(req, res){
    try {
        let getCatSubCatSubSub_resp = {};
        
    } catch (error) {
        
    }
}
