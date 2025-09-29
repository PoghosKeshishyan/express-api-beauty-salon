const { prisma } = require("../prisma/prisma-client");

const all = async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      include: {
        masters: true, 
      },
    });

    res.status(200).json(services);
  } catch (error) {
    res.status(400).json({ message: "Failed to receive", error: error.message });
  }
};

const service = async (req, res) => {
  const id = req.params.id;

  try {
    const service = await prisma.service.findUnique({
      where: { 
        id, 
      },
      include: { 
        masters: true, 
      },
    });

    res.status(200).json(service);
  } catch (error) {
    res.status(400).json({ message: "Failed to receive", error: error.message });
  }
};

const add = async (req, res) => {
  const { function: functionName, masterIds } = req.body;

  if (!functionName) {
    return res.status(400).json({
      message: "Function is required",
    });
  }

  try {
    const service = await prisma.service.create({
      data: {
        function: functionName,
        masters: masterIds
          ? {
            connect: masterIds.map(id => ({ id })),
          }
          : undefined,
      },
      include: { masters: true },
    });
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: "Failed to create service", error: error.message });
  }
};

const edit = async (req, res) => {
  const id = req.params.id;
  const { function: functionName, masterIds } = req.body;

  try {
    const service = await prisma.service.update({
      where: { id },
      data: {
        function: functionName,
        masters: masterIds
          ? {
            set: masterIds.map(id => ({ id })),
          }
          : undefined,
      },
      include: { masters: true },
    });
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: "Failed to edit service", error: error.message });
  }
};

const remove = async (req, res) => {
  const id = req.params.id;

  try {
    await prisma.service.delete({ 
      where: { 
        id, 
      }, 
    });
    
    res.status(200).json("OK");
  } catch (error) {
    res.status(500).json({ message: "Failed to delete", error: error.message });
  }
};

module.exports = { 
  all, 
  service, 
  add, 
  edit, 
  remove, 
};
