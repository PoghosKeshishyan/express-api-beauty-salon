const { prisma } = require("../prisma/prisma-client");

const all = async (req, res) => {
  try {
    const clients = await prisma.client.findMany({
      include: {
        masters: true,
        services: true,
      },
    });
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch clients", error: error.message });
  }
};

const client = async (req, res) => {
  const { id } = req.params;

  try {
    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        masters: true,
        services: true,
      },
    });

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch client", error: error.message });
  }
};

const add = async (req, res) => {
  const { name, phone, day, time, masterIds, serviceIds } = req.body;

  if (!name || !phone || !day || !time || !masterIds?.length || !serviceIds?.length) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Ստուգում ենք՝ արդյոք այս վարպետներից որևէ մեկը զբաղված է
    const isBusyMaster = await prisma.busyDates.findFirst({
      where: {
        masterId: { in: masterIds },
        day,
        time,
      },
    });

    if (isBusyMaster) {
      return res.status(400).json({ message: "One of the masters is already busy at that time" });
    }

    const result = await prisma.$transaction(async (tx) => {
      const client = await tx.client.create({
        data: {
          name,
          phone,
          day,
          time,
          masters: { connect: masterIds.map((id) => ({ id })) },
          services: { connect: serviceIds.map((id) => ({ id })) },
        },
        include: {
          masters: true,
          services: true,
        },
      });

      // Ամեն master և service-ի համար busy date ավելացնում ենք
      const busyDatesData = masterIds.flatMap((mId) =>
        serviceIds.map((sId) => ({
          masterId: mId,
          serviceId: sId,
          clientId: client.id,
          day,
          time,
        }))
      );

      await tx.busyDates.createMany({ data: busyDatesData });

      return client;
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to create client", error: error.message });
  }
};

const edit = async (req, res) => {
  const { id } = req.params;
  const { name, phone, day, time, masterIds, serviceIds } = req.body;

  try {
    const client = await prisma.client.update({
      where: { id },
      data: {
        name,
        phone,
        day,
        time,
        masters: {
          set: masterIds.map((id) => ({ id })),
        },
        services: {
          set: serviceIds.map((id) => ({ id })), 
        },
      },
      include: {
        masters: true,
        services: true,
      },
    });

    await prisma.busyDates.deleteMany({ where: { clientId: id } });

    const busyDatesData = masterIds.flatMap((mId) =>
      serviceIds.map((sId) => ({
        masterId: mId,
        serviceId: sId,
        clientId: id,
        day,
        time,
      }))
    );

    await prisma.busyDates.createMany({ data: busyDatesData });

    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ message: "Failed to update client", error: error.message });
  }
};

const remove = async (req, res) => {
  const { id } = req.params;

  try {
    const client = await prisma.client.findUnique({
      where: { id },
      include: { masters: true, services: true },
    });

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    await prisma.$transaction([
      prisma.busyDates.deleteMany({ where: { clientId: id } }),
      prisma.client.delete({ where: { id } }),
    ]);

    res.status(200).json({ message: "Client and related busy dates deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete client", error: error.message });
  }
};

module.exports = {
  all,
  client,
  add,
  edit,
  remove,
};
