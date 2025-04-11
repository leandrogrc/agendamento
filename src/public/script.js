const apiBaseUrl = "http://localhost:3000/appointments";
let selectedDate = "";
let selectedHour = "";
console.log("hello");
// Abrir o modal corretamente
function openBookingModal(hour) {
  selectedHour = hour;
  document.getElementById("nameModal").classList.remove("hidden");
}

// Fechar o modal corretamente
function closeBookingModal() {
  document.getElementById("nameModal").classList.add("hidden");
}

// Eventos dos botões do modal
document
  .getElementById("closeModal")
  .addEventListener("click", closeBookingModal);
document
  .getElementById("confirmBooking")
  .addEventListener("click", async function () {
    const clientName = document.getElementById("clientName").value.trim();
    if (!clientName) return;

    try {
      const response = await fetch(`${apiBaseUrl}/schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: selectedDate,
          hour: selectedHour,
          clientName,
        }),
      });
      const data = await response.json();
      document.getElementById("bookingMessage").textContent = data.message;

      closeBookingModal();
      document
        .getElementById("appointmentDate")
        .dispatchEvent(new Event("change"));
    } catch (error) {
      console.error("Error booking appointment:", error);
      document.getElementById("bookingMessage").textContent =
        "Failed to book appointment.";
    }
  });

// Adiciona evento nos botões dos horários
document
  .getElementById("appointmentDate")
  .addEventListener("change", async function () {
    selectedDate = this.value;
    const timeSlotsDiv = document.getElementById("timeSlots");
    timeSlotsDiv.innerHTML = "";

    try {
      const response = await fetch(`${apiBaseUrl}/${selectedDate}`);
      const slots = await response.json();

      slots.forEach((slot) => {
        const button = document.createElement("button");
        button.textContent = slot.hour.slice(0, 5);
        button.className = `p-3 rounded-lg text-white font-medium ${
          slot.available
            ? "bg-green-500 hover:bg-green-600"
            : "bg-gray-400 cursor-not-allowed"
        }`;
        button.disabled = !slot.available;

        if (slot.available) {
          button.addEventListener("click", () => openBookingModal(slot.hour));
        }

        timeSlotsDiv.appendChild(button);
      });
    } catch (error) {
      console.error("Error fetching slots:", error);
      timeSlotsDiv.innerHTML =
        "<p class='text-red-500'>Failed to load slots.</p>";
    }
  });
