
    const root = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('main section[id]');
    const form = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    const resumeBtn = document.getElementById('resumeBtn');

    document.getElementById('year').textContent = new Date().getFullYear();

    function setTheme(theme) {
      root.dataset.theme = theme;
      themeToggle.textContent = theme === 'dark' ? 'Light' : 'Dark';
      themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      localStorage.setItem('portfolio-theme', theme);
    }

    const storedTheme = localStorage.getItem('portfolio-theme');
    const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    setTheme(storedTheme || preferredTheme);

    themeToggle.addEventListener('click', () => {
      setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
    });

    menuToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      document.body.classList.toggle('menu-open', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        document.body.classList.remove('menu-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Open menu');
      });
    });

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16 });

    document.querySelectorAll('.reveal, .skill-bar').forEach((element) => revealObserver.observe(element));

    const activeObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px' });

    sections.forEach((section) => activeObserver.observe(section));

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (name.length < 2 || !emailPattern.test(email) || message.length < 10) {
        formStatus.textContent = 'Please complete all fields with a valid email and a message of at least 10 characters.';
        formStatus.style.color = '#c2410c';
        return;
      }

      formStatus.textContent = `Thank you, ${name}. Your message is ready to send. Connect this form to an email service when you publish it.`;
      formStatus.style.color = 'var(--accent)';
      form.reset();
    });

    function downloadResumePdf() {
      const content = [
        'BT',
        '/F2 28 Tf',
        '72 720 Td',
        '(Gwendolyn Suarilla) Tj',
        '/F1 15 Tf',
        '0 -30 Td',
        '(Beginner Web Developer | Photographer | Videographer) Tj',
        '0 -40 Td',
        '(Profile) Tj',
        '/F1 12 Tf',
        '0 -20 Td',
        '(Creative beginner programmer building responsive websites with HTML, CSS, and JavaScript.) Tj',
        '0 -16 Td',
        '(I combine web development with photography and videography to create visual stories.) Tj',
        '/F2 15 Tf',
        '0 -36 Td',
        '(Skills) Tj',
        '/F1 12 Tf',
        '0 -20 Td',
        '(HTML, CSS, JavaScript, Responsive Design, Photography, Videography, Editing) Tj',
        '/F2 15 Tf',
        '0 -36 Td',
        '(Projects) Tj',
        '/F1 12 Tf',
        '0 -20 Td',
        '(Video Editing Portfolio - a video editor creating clean, engaging, and impactful visuals that bring stories to life.) Tj',
        '0 -16 Td',
        '(Photography Portfolio - a photographer capturing real moments with clean, meaningful visuals.) Tj',
        '0 -16 Td',
        '(Focus List Mini App - JavaScript task list concept.) Tj',
        '/F2 15 Tf',
        '0 -36 Td',
        '(Contact) Tj',
        '/F1 12 Tf',
        '0 -20 Td',
        '(GitHub: github.com/gwenikels) Tj',
        '0 -16 Td',
        '(Email: gwensuarilla2004@gmail.com) Tj',
        'ET'
      ].join('\n');
      const objects = [
        '<< /Type /Catalog /Pages 2 0 R >>',
        '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
        '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>',
        '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
        '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>',
        `<< /Length ${content.length} >>\nstream\n${content}\nendstream`
      ];
      let pdf = '%PDF-1.4\n';
      const offsets = [0];

      objects.forEach((object, index) => {
        offsets.push(pdf.length);
        pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
      });

      const xrefStart = pdf.length;
      pdf += `xref\n0 ${objects.length + 1}\n`;
      pdf += '0000000000 65535 f \n';
      offsets.slice(1).forEach((offset) => {
        pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
      });
      pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
      const blob = new Blob([pdf], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Gwendolyn-Suarilla-Resume.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    }

    resumeBtn.addEventListener('click', downloadResumePdf);
  
    