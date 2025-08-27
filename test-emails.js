// Test script to send demo emails
const fetch = require('node-fetch');

const API_URL = 'http://localhost:3001';

// Test Contact Form Email
async function testContactForm() {
    console.log('\n📧 Testing Contact Form Email...\n');
    
    const contactData = {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@example.com',
        phone: '0412 345 678',
        address: '123 Test Street, Brisbane QLD 4000',
        propertyType: 'house',
        propertySize: '3-4bed',
        serviceType: ['one-off-deep-clean', 'post-construction-clean'],
        urgency: 'next-week',
        message: 'Hi Amie, I need a deep clean for my 4-bedroom house after renovation work. The builders just finished and there is quite a bit of dust. Can you please provide a quote? Thanks!',
        photos: true,
        hearAbout: 'Google search'
    };

    try {
        const response = await fetch(`${API_URL}/api/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(contactData)
        });

        const result = await response.json();
        
        if (response.ok) {
            console.log('✅ Contact form email sent successfully!');
            console.log('Response:', result);
            console.log('\nEmails sent to:');
            console.log('1. Notification → deepclean.go2@gmail.com');
            console.log('2. Confirmation → john.smith@example.com');
        } else {
            console.log('❌ Failed to send contact email:', result.message);
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.log('\n⚠️  Make sure to add your SendGrid API key to the .env file!');
    }
}

// Test Job Application Email
async function testApplicationForm() {
    console.log('\n📧 Testing Job Application Email...\n');
    
    const applicationData = {
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@example.com',
        phone: '0423 456 789',
        dob: '1995-06-15',
        address: '456 Application Ave, Redland Bay QLD 4165',
        residency: 'Australian Citizen',
        driversLicense: 'Yes',
        availability: 'Monday, Wednesday, Friday',
        hasExperience: 'No',
        experienceDetails: '',
        job1Company: 'Woolworths',
        job1Position: 'Customer Service',
        job1Duration: '2 years',
        job2Company: 'Local Cafe',
        job2Position: 'Barista',
        job2Duration: '1 year',
        job3Company: '',
        job3Position: '',
        job3Duration: '',
        whyJoin: 'I love making spaces clean and beautiful! I\'m very detail-oriented and take pride in my work. I heard great things about DEEP CLEAN and would love to be part of a team that values quality.',
        strengths: 'I\'m extremely organized, reliable, and have a keen eye for detail. I enjoy physical work and find cleaning therapeutic. I\'m also great with customers and always maintain a positive attitude.',
        ref1Name: 'Emma Wilson',
        ref1Relationship: 'Former Manager',
        ref1Phone: '0434 567 890',
        ref1Email: 'emma.w@example.com',
        ref2Name: 'Michael Brown',
        ref2Relationship: 'Former Colleague',
        ref2Phone: '0445 678 901',
        ref2Email: '',
        hasTransport: 'Yes',
        startDate: 'Immediately',
        additionalComments: 'I have my own car and am available to start right away. Flexible with hours!'
    };

    try {
        const response = await fetch(`${API_URL}/api/apply`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(applicationData)
        });

        const result = await response.json();
        
        if (response.ok) {
            console.log('✅ Job application email sent successfully!');
            console.log('Response:', result);
            console.log('\nEmails sent to:');
            console.log('1. Application → deepclean.go2@gmail.com');
            console.log('2. Confirmation → sarah.johnson@example.com');
        } else {
            console.log('❌ Failed to send application email:', result.message);
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.log('\n⚠️  Make sure to add your SendGrid API key to the .env file!');
    }
}

// Test API Health Check
async function testHealth() {
    console.log('🔍 Checking server status...\n');
    
    try {
        const response = await fetch(`${API_URL}/api/health`);
        const result = await response.json();
        console.log('Server status:', result);
        
        if (result.status === 'OK') {
            console.log('✅ Server is running!\n');
            return true;
        }
    } catch (error) {
        console.error('❌ Server is not running. Start it with: npm start');
        return false;
    }
}

// Run all tests
async function runTests() {
    console.log('========================================');
    console.log('   DEEP CLEAN Email System Test');
    console.log('========================================');
    
    const serverOk = await testHealth();
    
    if (!serverOk) {
        console.log('\n⚠️  Please start the server first with: npm start');
        return;
    }
    
    // Test contact form
    await testContactForm();
    
    // Wait 2 seconds between tests
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test application form
    await testApplicationForm();
    
    console.log('\n========================================');
    console.log('   Test Complete!');
    console.log('========================================');
    console.log('\nIf emails were sent successfully:');
    console.log('• Check deepclean.go2@gmail.com for notifications');
    console.log('• Check example emails for confirmations');
    console.log('\nIf they failed:');
    console.log('• Add your SendGrid API key to .env file');
    console.log('• Verify amie@deepclean.au in SendGrid');
}

// Run the tests
runTests();