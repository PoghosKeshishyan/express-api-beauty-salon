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
      path: `${req.protocol}://${req.get('host')}${elem.path}`,
      method: elem.methods[0],
      isLink: elem.methods[0] === 'GET' && !elem.path.includes('/:id'),
    });
  });

  res.render('index', { title: 'Express', fullData: groupedData });
});

module.exports = router;