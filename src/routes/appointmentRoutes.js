const express = require("express");
const router = express.Router();
const {
  bookAppointment,
  getAvailableSlots,
  cancelAppointment,
  updateAppointment
} = require("../controllers/appointmentController");

/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Agendar um novo horário
 *     description: Cria um novo agendamento com a data, hora e nome do cliente.
 *     tags:
 *       - Agendamentos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *               - hour
 *               - clientName
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-04-10"
 *               hour:
 *                 type: string
 *                 example: "14:00"
 *               clientName:
 *                 type: string
 *                 example: "João Silva"
 *     responses:
 *       201:
 *         description: Agendamento realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Agendamento realizado com sucesso
 *                 newAppointment:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 5
 *                     date:
 *                       type: string
 *                       example: "2025-04-09"
 *                     hour:
 *                       type: string
 *                       example: "10:00"
 *                     clientName:
 *                       type: string
 *                       example: "leandro"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-04-09T20:00:34.366Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-04-09T20:00:34.366Z"
 *       400:
 *         description: Horário já está ocupado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Este horário já está ocupado
 */

router.post("/schedule", bookAppointment);

/**
 * @swagger
 * /appointments:
 *   delete:
 *     summary: Cancelar um agendamento
 *     description: Deleta um agendamento específico e libera o horário correspondente.
 *     tags:
 *       - Agendamentos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *               - hour
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-04-10"
 *               hour:
 *                 type: string
 *                 example: "14:00:00"
 *     responses:
 *       200:
 *         description: Agendamento cancelado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Agendamento cancelado com sucesso
 *       404:
 *         description: Agendamento não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Agendamento não encontrado
 *       500:
 *         description: Erro ao cancelar o agendamento
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erro ao cancelar o agendamento
 */

router.delete("/schedule", cancelAppointment);

/**
 * @swagger
 * /appointments/{date}:
 *   get:
 *     summary: Retorna os horários disponíveis para o dia
 *     tags: 
 *      - Agendamentos
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         example: "2025-04-10"
 *         description: Data no formato YYYY-MM-DD
 *     responses:
 *       200:
 *         description: Lista de horários com status de disponibilidade
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   hour:
 *                     type: string
 *                     example: "14:00:00"
 *                   available:
 *                     type: boolean
 *                     example: true
 */

router.get("/:date", getAvailableSlots);

/**
 * @swagger
 * /appointments/{id}:
 *   put:
 *     summary: Atualiza um agendamento existente
 *     tags:
 *       - Agendamentos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do agendamento a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-04-11"
 *               hour:
 *                 type: string
 *                 example: "15:00:00"
 *               clientName:
 *                 type: string
 *                 example: "Maria Oliveira"
 *     responses:
 *       200:
 *         description: Agendamento atualizado com sucesso
 *         content:
 *           application/json:
 *             example:
 *               message: "Agendamento atualizado com sucesso"
 *               updatedAppointment:
 *                 id: 5
 *                 date: "2025-04-11"
 *                 hour: "15:00:00"
 *                 clientName: "Maria Oliveira"
 *                 createdAt: "2025-04-09T20:00:34.366Z"
 *                 updatedAt: "2025-04-10T18:32:15.123Z"
 *       400:
 *         description: Horário já está ocupado
 *       404:
 *         description: Agendamento não encontrado
 *       500:
 *         description: Erro interno ao atualizar o agendamento
 */

router.put("/schedule", updateAppointment);

module.exports = router;
