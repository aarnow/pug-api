const express     = require('express');
const router      = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const checkRole   = require('../middlewares/checkRoleMiddleware');
const {
    publicAccess,
    userAccess,
    moderatorAccess,
    adminAccess, editorAccess,
} = require('../controllers/testController');

router.get('/all', publicAccess);

// Auth required
router.get('/user',
    authMiddleware,
    checkRole('ROLE_USER', 'ROLE_ADMIN'),
    userAccess,
);

router.get('/editor',
    authMiddleware,
    checkRole('ROLE_EDITOR', 'ROLE_ADMIN'),
    editorAccess
);

router.get('/mod',
    authMiddleware,
    checkRole('ROLE_MODERATOR', 'ROLE_ADMIN'),
    moderatorAccess
);

// Admin uniquement
router.get('/admin',
    authMiddleware,
    checkRole('ROLE_ADMIN'),
    adminAccess
);

module.exports = router;