import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const outDir = '/home/victor/Downloads/gatipath_screenshots';

async function capture() {
  const mode = process.argv[2] || 'before'; // 'before' or 'after'
  const targetDir = path.join(outDir, mode);
  fs.mkdirSync(targetDir, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: '/home/victor/Downloads/chrome-wrapper.sh',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();

  // Helper to capture a page at both desktop and mobile resolutions
  async function snapshot(name, url, role = 'student', studentId = 'student-aarav') {
    // 1. Desktop (1440 x 900)
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
    
    // Set auth session and reload so AuthContext picks up the exact role
    await page.evaluate((r, sid) => {
      localStorage.setItem('gatipath_auth_session', JSON.stringify({ role: r, id: r === 'teacher' ? 'teacher-sunita' : sid }));
    }, role, studentId);
    await page.goto(`http://localhost:5173/#${url}`, { waitUntil: 'networkidle0' });
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600)); // give layout and charts time to settle
    
    const desktopFile = path.join(targetDir, `${name}_desktop_1440.png`);
    await page.screenshot({ path: desktopFile, fullPage: false });
    console.log(`Saved: ${desktopFile}`);

    // 2. Mobile (390 x 844)
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
    await page.goto(`http://localhost:5173/#${url}`, { waitUntil: 'networkidle0' });
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    const mobileFile = path.join(targetDir, `${name}_mobile_390.png`);
    await page.screenshot({ path: mobileFile, fullPage: false });
    console.log(`Saved: ${mobileFile}`);
  }

  try {
    console.log(`--- CAPTURING ${mode.toUpperCase()} SCREENSHOTS ---`);
    // 1. Student Dashboard
    await snapshot('1_student_dashboard', '/student/dashboard', 'student', 'student-aarav');
    // 2. Teacher Dashboard
    await snapshot('2_teacher_dashboard', '/teacher/dashboard', 'teacher');
    // 3. Student Roster
    await snapshot('3_student_roster', '/teacher/students', 'teacher');
    // 4. Student Profile (Aarav)
    await snapshot('4_student_profile', '/teacher/student/student-aarav', 'teacher');
    // 5. Class Insights
    await snapshot('5_class_insights', '/teacher/insights', 'teacher');
    // 6. Interventions
    await snapshot('6_interventions', '/teacher/interventions', 'teacher');

    console.log(`Successfully completed all screenshots for [${mode}]!`);
  } finally {
    await browser.close();
  }
}

capture().catch(err => {
  console.error('Capture error:', err);
  process.exit(1);
});
