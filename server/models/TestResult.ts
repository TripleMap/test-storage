import * as mongoose from 'mongoose';
import * as crypto from 'crypto';

const TestResultSchema = new mongoose.Schema({
  _id: {
    type: String,
    unique: true,
    default: function () {
      return crypto.randomBytes(16).toString('hex');
    }
  },
  testcaseId: String,
  testrunId: String,
  testplanId: String,
  status: {
    type: String,
    enum: ['PASSED', 'FAILED', 'BLOCKED', 'WIP', 'SKIPPED', 'UNTESTED'],
    default: 'UNTESTED'
  },
  created: { type: Date, required: true, default: Date.now },
  updated: { type: Date, required: true, default: Date.now },
  createdBy: String,
  updatedBy: String
});

const TestResult = mongoose.model('TestResult', TestResultSchema);
export { TestResult };
