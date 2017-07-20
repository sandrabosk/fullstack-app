function loggedInApi (req, res, next) {
    if (req.isAuthenticated()) {
      next();
      return;
    }

    res.status(401).json({ message: 'Gotta be logged in.' });
}


module.exports = loggedInApi;
