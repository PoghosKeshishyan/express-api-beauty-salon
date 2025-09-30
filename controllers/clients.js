const { prisma } = require("../prisma/prisma-client");

const all = async (req, res) => {
    try {
        const clients = await prisma.client.findMany({
            include: {
                master: true,
                service: true,
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
            where: {
                id,
            },
            include: {
                master: true,
                service: true,
            },
        });

        if (!client) {
            return res.status(404).json({
                message:
                    "Client not found",
            });
        }

        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch client", error: error.message });
    }
};

const add = async (req, res) => {
    const data = req.body;

    if (
        !data.name ||
        !data.phone ||
        !data.day ||
        !data.time ||
        !data.masterId ||
        !data.serviceId
    ) {
        return res.status(400).json({
            message: "All fields are required",
        });
    }

    try {
        const isBusyMaster = await prisma.busyDates.findFirst({
            where: {
                masterId: data.masterId,
                day: data.day,
                time: data.time
            }
        });

        if (isBusyMaster) {
            return res.status(400).json({
                message: "This master is already busy at that time"
            });
        }

        const [client, busyDate] = await prisma.$transaction([
            prisma.client.create({
                data,
                include: {
                    master: true,
                    service: true,
                },
            }),
            prisma.busyDates.create({
                data: {
                    masterId: data.masterId,
                    day: data.day,
                    time: data.time
                }
            })
        ]);

        res.status(201).json({
            client,
            busyDate
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create client",
            error: error.message
        });
    }
};

const edit = async (req, res) => {
  const { id } = req.params;
  const { name, phone, day, time, masterId, serviceId } = req.body;

  try {
    const [client, busyDate] = await prisma.$transaction([
      prisma.client.update({
        where: { id },
        data: {
          name,
          phone,
          day,
          time,
          masterId,
          serviceId,
        },
        include: {
          master: true,
          service: true,
        },
      }),

      prisma.busyDates.deleteMany({
        where: { masterId, day, time },
      }),

      prisma.busyDates.create({
        data: {
          masterId,
          day,
          time,
        },
      }),
    ]);

    res.status(200).json({ client, busyDate });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update client",
      error: error.message,
    });
  }
};

const remove = async (req, res) => {
  const { id } = req.params;

  try {
    const client = await prisma.client.findUnique({ where: { id } });

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    await prisma.$transaction([
      prisma.busyDates.deleteMany({
        where: {
          masterId: client.masterId,
          day: client.day,
          time: client.time,
        },
      }),
      prisma.client.delete({
        where: { id },
      }),
    ]);

    res.status(200).json({ message: "Client and related busy dates deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete client",
      error: error.message,
    });
  }
};

module.exports = {
    all,
    client,
    add,
    edit,
    remove,
};