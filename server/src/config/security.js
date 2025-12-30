module.exports = {
  helmet: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'", "data:"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"]
      }
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    referrerPolicy: {
      policy: 'strict-origin-when-cross-origin'
    },
    permissionsPolicy: {
      features: {
        camera: ["'none'"],
        microphone: ["'none'"],
        geolocation: ["'none'"],
        payment: ["'none'"]
      }
    }
  },

  bcrypt: {
    saltRounds: 10
  },

  rateLimit: {
    upload: {
      windowMs: 60 * 60 * 1000,
      max: 10,
      message: { error: 'Too many uploads, please try again later' }
    },
    download: {
      windowMs: 1 * 60 * 1000,
      max: 5,
      skipSuccessfulRequests: true,
      message: { error: 'Too many download attempts, please try again later' }
    },
    general: {
      windowMs: 15 * 60 * 1000,
      max: 100,
      message: { error: 'Too many requests, please try again later' }
    }
  }
};