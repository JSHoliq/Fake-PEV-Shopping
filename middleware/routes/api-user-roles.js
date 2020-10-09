const { Router } = require('express');
const { middlewareFn: authMiddleware } = require('../features/auth');
const { saveToDB, getFromDB } = require('../../database/index');

const router = Router();

router.post('/api/user-roles', authMiddleware(getFromDB), async (req, res) => {
  console.log('[POST] /user-roles:', req.body);

  const userRole = {
    roleName: req.body.roleName,
    owner: req.user._id,
  };
  console.log('userRole: ', userRole);

  const savedUserRole = await saveToDB(userRole, 'UserRole');
  savedUserRole.save();

  console.log('savedUserRole:', savedUserRole);

  res.status(200).json({ payload: savedUserRole });
});

module.exports = router;
