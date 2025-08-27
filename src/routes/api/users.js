/**
 * @fileoverview User Management API Routes
 * @description RESTful API endpoints for user operations with comprehensive documentation
 * @version 1.0.0
 * @author itseze Development Team
 */

import express from 'express';
import { body, param, query, validationResult } from 'express-validator';

import { authenticate, authorize } from '../../middleware/auth.js';
import { rateLimit } from '../../middleware/rateLimit.js';

const router = express.Router();

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: List all users
 *     description: Retrieve a paginated list of users with optional filtering
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *       - apiKeyAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - $ref: '#/components/parameters/SortParam'
 *       - name: role
 *         in: query
 *         description: Filter users by role
 *         schema:
 *           type: string
 *           enum: [user, admin, moderator]
 *       - name: verified
 *         in: query
 *         description: Filter by verification status
 *         schema:
 *           type: boolean
 *       - name: search
 *         in: query
 *         description: Search users by name or email
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     totalCount:
 *                       type: integer
 *                       example: 150
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     pageSize:
 *                       type: integer
 *                       example: 20
 *                     totalPages:
 *                       type: integer
 *                       example: 8
 *             examples:
 *               success:
 *                 summary: Successful response
 *                 value:
 *                   success: true
 *                   data:
 *                     - id: "usr_1234567890"
 *                       email: "john.doe@example.com"
 *                       name: "John Doe"
 *                       role: "user"
 *                       verified: true
 *                       createdAt: "2024-01-15T10:00:00Z"
 *                   metadata:
 *                     totalCount: 150
 *                     page: 1
 *                     pageSize: 20
 *                     totalPages: 8
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       429:
 *         $ref: '#/components/responses/RateLimitExceeded'
 */
router.get('/', 
  authenticate,
  authorize(['admin', 'moderator']),
  rateLimit({ windowMs: 60000, max: 100 }),
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('role').optional().isIn(['user', 'admin', 'moderator']),
    query('verified').optional().isBoolean(),
    query('search').optional().isString().isLength({ min: 2 })
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: errors.array()
        });
      }

      const { page = 1, limit = 20, role, verified, search, sort = 'createdAt:desc' } = req.query;
      
      // Build filter object
      const filters = {};
      if (role) filters.role = role;
      if (verified !== undefined) filters.verified = verified === 'true';
      if (search) {
        filters.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }

      // Parse sort parameter
      const [sortField, sortOrder] = sort.split(':');
      const sortOptions = { [sortField]: sortOrder === 'desc' ? -1 : 1 };

      // Execute query with pagination
      const users = await User.find(filters)
        .sort(sortOptions)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .select('-password -refreshTokens')
        .exec();

      const totalCount = await User.countDocuments(filters);

      res.json({
        success: true,
        data: users,
        metadata: {
          totalCount,
          page: parseInt(page),
          pageSize: parseInt(limit),
          totalPages: Math.ceil(totalCount / limit)
        }
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch users',
        code: 'INTERNAL_ERROR'
      });
    }
  }
);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieve detailed information about a specific user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *         example: "usr_1234567890"
 *     responses:
 *       200:
 *         description: User found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/:id',
  authenticate,
  [param('id').isString().isLength({ min: 10 })],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Invalid user ID format',
          code: 'VALIDATION_ERROR',
          details: errors.array()
        });
      }

      const user = await User.findById(req.params.id)
        .select('-password -refreshTokens')
        .exec();

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        });
      }

      // Check if user can access this profile
      if (req.user.id !== user.id && !['admin', 'moderator'].includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          error: 'Access denied',
          code: 'FORBIDDEN'
        });
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch user',
        code: 'INTERNAL_ERROR'
      });
    }
  }
);

/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     summary: Create a new user
 *     description: Create a new user account with validation
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, name]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User email address
 *                 example: "newuser@example.com"
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 description: User password (minimum 8 characters)
 *                 example: "securePassword123"
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 description: User display name
 *                 example: "New User"
 *               role:
 *                 type: string
 *                 enum: [user, admin, moderator]
 *                 description: User role (admin only)
 *                 example: "user"
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       409:
 *         description: Email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/',
  authenticate,
  authorize(['admin']),
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
    body('name').isString().isLength({ min: 2, max: 100 }).trim(),
    body('role').optional().isIn(['user', 'admin', 'moderator'])
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: errors.array()
        });
      }

      const { email, password, name, role = 'user' } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: 'User with this email already exists',
          code: 'EMAIL_EXISTS'
        });
      }

      // Create new user
      const user = new User({
        email,
        password, // Will be hashed by pre-save middleware
        name,
        role
      });

      await user.save();

      // Remove sensitive data from response
      const userResponse = user.toObject();
      delete userResponse.password;
      delete userResponse.refreshTokens;

      res.status(201).json({
        success: true,
        data: userResponse
      });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create user',
        code: 'INTERNAL_ERROR'
      });
    }
  }
);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   put:
 *     summary: Update user
 *     description: Update user information
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *               email:
 *                 type: string
 *                 format: email
 *               role:
 *                 type: string
 *                 enum: [user, admin, moderator]
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 */
router.put('/:id',
  authenticate,
  [
    param('id').isString(),
    body('name').optional().isString().isLength({ min: 2, max: 100 }).trim(),
    body('email').optional().isEmail().normalizeEmail(),
    body('role').optional().isIn(['user', 'admin', 'moderator'])
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: errors.array()
        });
      }

      const { id } = req.params;
      const updates = req.body;

      // Check permissions
      if (req.user.id !== id && !['admin'].includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          error: 'Access denied',
          code: 'FORBIDDEN'
        });
      }

      // Remove role change for non-admin users
      if (!['admin'].includes(req.user.role)) {
        delete updates.role;
      }

      const user = await User.findByIdAndUpdate(
        id,
        { ...updates, updatedAt: new Date() },
        { new: true, runValidators: true }
      ).select('-password -refreshTokens');

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        });
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update user',
        code: 'INTERNAL_ERROR'
      });
    }
  }
);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   delete:
 *     summary: Delete user
 *     description: Delete a user account (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 */
router.delete('/:id',
  authenticate,
  authorize(['admin']),
  [param('id').isString()],
  async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        });
      }

      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete user',
        code: 'INTERNAL_ERROR'
      });
    }
  }
);

export default router;