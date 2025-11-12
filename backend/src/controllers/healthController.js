export const healthController = {
  status: (_req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString()
    });
  }
};

