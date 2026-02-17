const { User, Role } = require('../models');

/**
 * Vérifie que l'utilisateur authentifié possède au moins un des rôles requis.
 */
function checkRole(...roles) {
    return async (req, res, next) => {
        try {
            const user = await User.findByPk(req.user.id, {
                include: [{ model: Role }],
            });

            if (!user) {
                return res.status(401).json({ error: 'User not found' });
            }

            const userRoles = user.Roles.map((r) => r.name);
            const hasRole   = roles.some((role) => userRoles.includes(role));

            if (!hasRole) {
                return res.status(403).json({ error: 'Access denied : insufficient role' });
            }

            next();
        } catch (err) {
            next(err);
        }
    };
}

module.exports = checkRole;