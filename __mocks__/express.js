const router = Object.freeze({
  get: jest.fn(),
  post: jest.fn(),
  patch: jest.fn(),
});
const express = jest.fn();
express.Router = jest.fn(() => router);
express._router = router;

module.exports = express;