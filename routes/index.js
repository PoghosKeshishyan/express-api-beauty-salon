const express = require('express');
const expressListEndpoints = require('express-list-endpoints');
const router = express.Router();

router.get('/', function (req, res) {
  const apis = expressListEndpoints(req.app);
  const groupedData = {};

  apis.forEach((elem) => {
    const pathParts = elem.path.split('/').filter(Boolean);

    if (pathParts[0] !== 'api') return;

    const resource = pathParts[1];

    if (!groupedData[resource]) {
      groupedData[resource] = [];
    }

    groupedData[resource].push({
      path: elem.path,
      method: elem.methods[0],
      isLink: elem.methods[0] === 'GET' && !elem.path.includes('/:id'),
    });
  });

  console.log(groupedData);
  

  res.render('index', { title: 'Express', fullData: groupedData });
});

module.exports = router;