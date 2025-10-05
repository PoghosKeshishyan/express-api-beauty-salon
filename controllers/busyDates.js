const { prisma } = require("../prisma/prisma-client");

const all = async (req, res) => {
  try {
    const busyDates = await prisma.busyDates.findMany({
      include: {
        master: true,
        service: true,
        client: true,
      },
    });
    res.status(200).json(busyDates);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch busy dates", error: error.message });
  }
};

const getOne = async (req, res) => {
  const { id } = req.params;

  try {
    const busyDate = await prisma.busyDates.findUnique({
      where: { id },
      include: {
        master: true,
        service: true,
        client: true,
      },
    });

    if (!busyDate) {
      return res.status(404).json({ message: "Busy date not found" });
    }

    res.status(200).json(busyDate);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch busy date", error: error.message });
  }
};

const add = async (req, res) => {
  const { day, time, masterId } = req.body;

  if (!day || !time || !masterId) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const busyDate = await prisma.busyDates.create({
      data: {
        day,
        time,
        masterId,
      },
      include: {
        master: true,
      },
    });

    res.status(201).json(busyDate);
  } catch (error) {
    res.status(500).json({ message: "Failed to create busy date", error: error.message });
  }
};

const edit = async (req, res) => {
  const { id } = req.params;
  const { day, time, masterId } = req.body;

  try {
    const busyDate = await prisma.busyDates.update({
      where: { id },
      data: {
        day,
        time,
        masterId,
      },
      include: {
        master: true,
      },
    });

    res.status(200).json(busyDate);
  } catch (error) {
    res.status(500).json({ message: "Failed to update busy date", error: error.message });
  }
};

const remove = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.busyDates.delete({
      where: { id },
    });

    res.status(200).json({ message: "Busy date deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete busy date", error: error.message });
  }
};

module.exports = {
  all,
  getOne,
  add,
  edit,
  remove,
};
