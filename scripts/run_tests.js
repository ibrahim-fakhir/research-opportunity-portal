/**
 * Automated API Integration Test Suite
 * Validates all 8 requirements from Section 6 of Assignment #01:
 *  1. Creating at least three research opportunities (201 Created)
 *  2. Retrieving all research opportunities (200 OK)
 *  3. Retrieving one opportunity using its ID (200 OK)
 *  4. Updating an existing opportunity (200 OK)
 *  5. Changing an opportunity's status from Open to Closed (200 OK)
 *  6. Deleting an opportunity (200 OK)
 *  7. Requesting the deleted opportunity again (404 Not Found)
 *  8. Sending invalid/missing data request (400 Bad Request)
 */

const http = require('http');
const { app } = require('../src/server');

const TEST_PORT = 5099;
let server;

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: TEST_PORT,
        path: path,
        method: method,
        headers: {
          'Content-Type': 'application/json',
          ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {})
        }
      },
      (res) => {
        let responseData = '';
        res.on('data', (chunk) => (responseData += chunk));
        res.on('end', () => {
          let parsed = null;
          try {
            parsed = JSON.parse(responseData);
          } catch (e) {
            parsed = responseData;
          }
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: parsed
          });
        });
      }
    );

    req.on('error', reject);

    if (payload) {
      req.write(payload);
    }
    req.end();
  });
}

async function runTests() {
  console.log('\n=============================================================');
  console.log('  RUNNING AUTOMATED ASSIGNMENT #1 API TEST SUITE');
  console.log('=============================================================\n');

  let passedTests = 0;
  let totalTests = 8;
  let createdOpportunityId = null;

  try {
    // -----------------------------------------------------------------
    // TEST 1: Create at least three research opportunities
    // -----------------------------------------------------------------
    console.log('[Test 1/8] Creating at least three research opportunities...');
    const opp1 = {
      title: 'Automated Drone Navigation via Edge Computing',
      description: 'Developing low-power visual SLAM pipelines on embedded NVIDIA Jetson platforms.',
      research_area: 'Autonomous Systems & Edge AI',
      faculty_name: 'Dr. Shahzad Ahmed',
      department: 'Computer Science',
      required_skills: 'C++, ROS2, Linux, OpenCV, Python',
      available_positions: 2,
      application_deadline: '2026-12-15',
      status: 'Open'
    };
    const opp2 = {
      title: 'Blockchain Consensus Optimization in Sharded Networks',
      description: 'Simulation and formal verification of BFT consensus scaling in high-throughput payment channels.',
      research_area: 'Distributed Networks',
      faculty_name: 'Dr. Bilal Khan',
      department: 'Software Engineering',
      required_skills: 'Go, Solidity, Distributed Systems, Cryptography',
      available_positions: 3,
      application_deadline: '2026-11-20',
      status: 'Open'
    };
    const opp3 = {
      title: 'Graph Neural Networks for Protein Folding Prediction',
      description: 'Applying geometric deep learning to predict ligand binding affinity in mutated enzymes.',
      research_area: 'Bioinformatics & Machine Learning',
      faculty_name: 'Dr. Zeeshan Haider',
      department: 'Data Science & AI',
      required_skills: 'Python, PyTorch Geometric, R, BioPython',
      available_positions: 1,
      application_deadline: '2026-12-01',
      status: 'Open'
    };

    const res1 = await makeRequest('POST', '/api/opportunities', opp1);
    const res2 = await makeRequest('POST', '/api/opportunities', opp2);
    const res3 = await makeRequest('POST', '/api/opportunities', opp3);

    if (res1.statusCode === 201 && res2.statusCode === 201 && res3.statusCode === 201) {
      createdOpportunityId = res1.body.data.id;
      console.log(`  ✓ Passed: Created 3 opportunities successfully (201 Created). New ID: #${createdOpportunityId}`);
      passedTests++;
    } else {
      console.error(`  ✗ Failed: Expected status 201 for all 3 creations. Received: ${res1.statusCode}, ${res2.statusCode}, ${res3.statusCode}`);
    }

    // -----------------------------------------------------------------
    // TEST 2: Retrieve all research opportunities
    // -----------------------------------------------------------------
    console.log('\n[Test 2/8] Retrieving all research opportunities...');
    const resAll = await makeRequest('GET', '/api/opportunities');
    if (resAll.statusCode === 200 && resAll.body.success && Array.isArray(resAll.body.data) && resAll.body.data.length >= 3) {
      console.log(`  ✓ Passed: Retrieved ${resAll.body.data.length} opportunities (200 OK).`);
      passedTests++;
    } else {
      console.error(`  ✗ Failed: Expected status 200 and array data. Received: ${resAll.statusCode}`);
    }

    // -----------------------------------------------------------------
    // TEST 3: Retrieve one opportunity using its ID
    // -----------------------------------------------------------------
    console.log(`\n[Test 3/8] Retrieving one opportunity using its ID (#${createdOpportunityId})...`);
    const resSingle = await makeRequest('GET', `/api/opportunities/${createdOpportunityId}`);
    if (resSingle.statusCode === 200 && resSingle.body.success && resSingle.body.data.id === createdOpportunityId) {
      console.log(`  ✓ Passed: Successfully retrieved opportunity details for #${createdOpportunityId} (200 OK).`);
      console.log(`    Title: "${resSingle.body.data.title}"`);
      passedTests++;
    } else {
      console.error(`  ✗ Failed: Expected status 200 and matching ID. Received: ${resSingle.statusCode}`);
    }

    // -----------------------------------------------------------------
    // TEST 4: Updating an existing opportunity
    // -----------------------------------------------------------------
    console.log(`\n[Test 4/8] Updating opportunity #${createdOpportunityId}...`);
    const updatePayload = {
      title: 'Automated Drone Navigation via Edge Computing (Phase 2)',
      available_positions: 4,
      required_skills: 'C++, ROS2, Linux, OpenCV, Python, CUDA'
    };
    const resUpdate = await makeRequest('PUT', `/api/opportunities/${createdOpportunityId}`, updatePayload);
    if (
      resUpdate.statusCode === 200 &&
      resUpdate.body.success &&
      resUpdate.body.data.available_positions === 4 &&
      resUpdate.body.data.title.includes('Phase 2')
    ) {
      console.log(`  ✓ Passed: Successfully updated opportunity fields (200 OK).`);
      console.log(`    New Positions: ${resUpdate.body.data.available_positions}`);
      passedTests++;
    } else {
      console.error(`  ✗ Failed: Expected status 200 with updated fields. Received: ${resUpdate.statusCode}`);
    }

    // -----------------------------------------------------------------
    // TEST 5: Changing an opportunity's status from Open to Closed
    // -----------------------------------------------------------------
    console.log(`\n[Test 5/8] Changing status of opportunity #${createdOpportunityId} from Open to Closed...`);
    const resClose = await makeRequest('PUT', `/api/opportunities/${createdOpportunityId}`, { status: 'Closed' });
    if (resClose.statusCode === 200 && resClose.body.success && resClose.body.data.status === 'Closed') {
      console.log(`  ✓ Passed: Status successfully changed to "Closed" (200 OK).`);
      passedTests++;
    } else {
      console.error(`  ✗ Failed: Expected status 200 and status="Closed". Received: ${resClose.statusCode}`);
    }

    // -----------------------------------------------------------------
    // TEST 6: Deleting an opportunity
    // -----------------------------------------------------------------
    console.log(`\n[Test 6/8] Deleting opportunity #${createdOpportunityId}...`);
    const resDelete = await makeRequest('DELETE', `/api/opportunities/${createdOpportunityId}`);
    if (resDelete.statusCode === 200 && resDelete.body.success) {
      console.log(`  ✓ Passed: Successfully deleted opportunity #${createdOpportunityId} (200 OK).`);
      passedTests++;
    } else {
      console.error(`  ✗ Failed: Expected status 200 for deletion. Received: ${resDelete.statusCode}`);
    }

    // -----------------------------------------------------------------
    // TEST 7: Requesting the deleted opportunity again (Expect 404 Not Found)
    // -----------------------------------------------------------------
    console.log(`\n[Test 7/8] Requesting deleted opportunity #${createdOpportunityId} to demonstrate 404 Not Found...`);
    const res404 = await makeRequest('GET', `/api/opportunities/${createdOpportunityId}`);
    if (res404.statusCode === 404 && res404.body.success === false) {
      console.log(`  ✓ Passed: Correctly returned 404 Not Found.`);
      console.log(`    Message: "${res404.body.error}"`);
      passedTests++;
    } else {
      console.error(`  ✗ Failed: Expected status 404. Received: ${res404.statusCode}`);
    }

    // -----------------------------------------------------------------
    // TEST 8: Sending invalid or missing data to demonstrate input validation (Expect 400 Bad Request)
    // -----------------------------------------------------------------
    console.log('\n[Test 8/8] Sending request with missing/invalid data to demonstrate input validation (Expect 400 Bad Request)...');
    const invalidPayload = {
      title: '', // Missing title
      faculty_name: '', // Missing faculty
      available_positions: -5, // Invalid negative positions
      application_deadline: 'invalid-date-format' // Invalid date
    };
    const res400 = await makeRequest('POST', '/api/opportunities', invalidPayload);
    if (res400.statusCode === 400 && res400.body.success === false && Array.isArray(res400.body.details)) {
      console.log(`  ✓ Passed: Correctly rejected with 400 Bad Request.`);
      console.log(`    Validation Errors count: ${res400.body.details.length}`);
      res400.body.details.forEach(err => console.log(`      - ${err}`));
      passedTests++;
    } else {
      console.error(`  ✗ Failed: Expected status 400 with validation details. Received: ${res400.statusCode}`);
    }

  } catch (err) {
    console.error('Fatal error during test execution:', err);
  } finally {
    console.log('\n=============================================================');
    console.log(`  TEST SUMMARY: ${passedTests}/${totalTests} TESTS PASSED`);
    console.log('=============================================================\n');

    server.close(() => {
      process.exit(passedTests === totalTests ? 0 : 1);
    });
  }
}

// Start test server and trigger tests
server = app.listen(TEST_PORT, () => {
  runTests();
});
