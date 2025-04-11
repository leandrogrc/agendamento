const Appointment = require("../models/Appointment");

// 📌 Agendar um novo horário
exports.bookAppointment = async (req, res) => {
  const { date, hour, clientName } = req.body;

  try {
    const newAppointment = await Appointment.create({ date, hour, clientName });
    res.status(201).json({
      message: "Agendamento realizado com sucesso",
      newAppointment,
    });
  } catch (error) {
    res.status(400).json({
      message: "Este horário já está ocupado",
    });
  }
};

// 📌 Cancel an appointment
exports.cancelAppointment = async (req, res) => {
  const { date, hour } = req.body;

  try {
    const appointment = await Appointment.findOne({ where: { date, hour } });

    if (!appointment) {
      return res.status(404).json({ message: "Agendamento não encontrado" });
    }

    await appointment.destroy();

    res.json({ message: "Agendamento cancelado com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao cancelar o agendamento" });
  }
};


// 📌 Get available slots for a day
exports.getAvailableSlots = async (req, res) => {
  const { date } = req.params;
  const takenAppointments = await Appointment.findAll({ where: { date } });

  const allSlots = Array.from({ length: 10 }, (_, i) => ({
    hour: `${i + 8}:00:00`, // Appointments from 08:00 to 17:00
    available: true,
  }));

  takenAppointments.forEach((appointment) => {
    const index = allSlots.findIndex((s) => s.hour === appointment.hour);
    if (index !== -1) allSlots[index].available = false;
  });

  res.json(allSlots);
};

// 📌 Editar um agendamento existente
exports.updateAppointment = async (req, res) => {
  const { id } = req.params;
  const { date, hour, clientName } = req.body;

  try {
    const appointment = await Appointment.findByPk(id);

    if (!appointment) {
      return res.status(404).json({ message: "Agendamento não encontrado" });
    }

    // Verifica se já existe outro agendamento no mesmo horário e data
    const conflictingAppointment = await Appointment.findOne({
      where: {
        date,
        hour,
        id: { [require("sequelize").Op.ne]: id }, // ignora o próprio agendamento
      },
    });

    if (conflictingAppointment) {
      return res.status(400).json({
        message: "Este horário já está ocupado por outro agendamento",
      });
    }

    // Atualiza os campos
    appointment.date = date || appointment.date;
    appointment.hour = hour || appointment.hour;
    appointment.clientName = clientName || appointment.clientName;

    await appointment.save();

    res.status(200).json({
      message: "Agendamento atualizado com sucesso",
      updatedAppointment: appointment,
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar o agendamento" });
  }
};
