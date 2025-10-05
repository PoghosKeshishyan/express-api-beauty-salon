const { prisma } = require("../prisma/prisma-client");

const all = async (req, res) => {
  try {
    const masters = await prisma.master.findMany({
      include: {
        services: true,
        busyDates: {
          select: {
            id: true,
            day: true,
            time: true,
            master: true,
            service: true,
          }
        },
        user: {
          select: {
            id: true,
            username: true,
            role: true,
          },
        },
      },
    });
    res.status(200).json(masters);
  } catch (error) {
    res.status(400).json({ message: "Failed to receive", error: error.message });
  }
};

const master = async (req, res) => {
  const id = req.params.id;
  try {
    const master = await prisma.master.findUnique({
      where: { id },
      include: {
        services: true,
        busyDates: true,
        user: {
          select: {
            id: true,
            username: true,
            role: true,
          },
        },
      },
    });
    res.status(200).json(master);
  } catch (error) {
    res.status(400).json({ message: "Failed to receive", error: error.message });
  }
};

const add = async (req, res) => {
  const { name, userId, serviceIds } = req.body;

  if (!name) {
    return res.status(400).json({
      message: "Name is required",
    });
  }

  try {
    const master = await prisma.master.create({
      data: {
        name,
        userId: userId || null,
        services: serviceIds
          ? {
            connect: serviceIds.map(id => ({ id })),
          }
          : undefined,
      },
      include: {
        services: true,
        user: {
          select: {
            id: true,
            username: true,
            role: true,
          },
        },
      },
    });

    res.status(201).json(master);
  } catch (error) {
    res.status(500).json({ message: "Failed to create master", error: error.message });
  }
};

const edit = async (req, res) => {
  const id = req.params.id;
  const { name, userId, serviceIds } = req.body;

  try {
    const master = await prisma.master.update({
      where: { id },
      data: {
        name,
        userId,
        services: serviceIds
          ? {
            set: serviceIds.map(id => ({
              id,
            })),
          }
          : undefined,
      },
      include: {
        services: true,
        user: {
          select: {
            id: true,
            username: true,
            role: true,
          },
        },
      },
    });
    res.status(200).json(master);
  } catch (error) {
    res.status(500).json({ message: "Failed to edit master", error: error.message });
  }
};

const remove = async (req, res) => {
  const id = req.params.id;

  try {
    await prisma.master.delete({ 
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
  master,
  add,
  edit,
  remove,
};
