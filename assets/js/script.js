let itemCount = 1;

    // Function to get current time period
    const periode = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'pagi';
        if (hour < 15) return 'siang';
        if (hour < 18) return 'sore';
        return 'malam';
    }

    // Function to format phone number
    const formatPhoneNumber = (phone) => {
        if (phone.startsWith('08') || phone.startsWith('628')) {
            return '62' + phone.substring(1);
        }
        return phone;
    }

    // Function to format number with thousand separator
    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    // Function to remove formatting from number
    const unformatNumber = (str) => {
        return str.replace(/\./g, '');
    }

    // Function to handle price input formatting
    const handlePriceInput = (input) => {
        let value = input.value;
        // Remove all dots first
        value = unformatNumber(value);
        // Only allow numbers
        value = value.replace(/[^0-9]/g, '');
        // Format with dots
        if (value) {
            input.value = formatNumber(value);
        } else {
            input.value = '';
        }
    }

    // Function to calculate total
    const calculateTotal = () => {
        let total = 0;
        document.querySelectorAll('.item-row').forEach(row => {
            const qty = parseInt(row.querySelector('.item-qty').value) || 0;
            const priceStr = row.querySelector('.item-price').value;
            const price = parseInt(unformatNumber(priceStr)) || 0;
            total += qty * price;
        });
        return total;
    }

    // Function to generate message
    const generateMessage = () => {
        const nameInput = document.querySelector('#customer_name');
        const companyInput = document.querySelector('#customer_company');
        const phoneInput = document.querySelector('#customer_phone');
        const brandInput = document.querySelector('#brand');
        const typeBrandInput = document.querySelector('#type_brand');
        const serialNumberInput = document.querySelector('#serial_number');
        const problemTextarea = document.querySelector('#problem');
        const notesTextarea = document.querySelector('#notes');

        const companyText = companyInput.value ? `- *${companyInput.value}*` : '';
        
        let itemsText = '';
        document.querySelectorAll('.item-row').forEach(row => {
            const name = row.querySelector('.item-name').value;
            const qty = row.querySelector('.item-qty').value;
            const priceStr = row.querySelector('.item-price').value;
            const price = parseInt(unformatNumber(priceStr)) || 0;
            const subtotal = parseInt(qty) * price;
            itemsText += `- *${name}* *@ ${qty}* x Rp. *${formatNumber(price)}* = Rp. *${formatNumber(subtotal)}*\n`;
        });

        const total = calculateTotal();
        
        // Add notes section if there's content
        const notesSection = notesTextarea.value ? `\n\n------ Catatan ------\n*${notesTextarea.value}*` : '';

        const textMessage = `Selamat ${periode()} Bpk/Ibu *${nameInput.value}* ${companyText}

Kami ingin memberitahukan terkait perangkat yang akan digantikan.

------ Detail Perangkat ------
Merk: *${brandInput.value}* - *${typeBrandInput.value}*
Serial Number: *${serialNumberInput.value}*
Masalah: *${problemTextarea.value}*

------ Pergantian Item ------
${itemsText}
------ Total ------
*Rp. ${formatNumber(total)}*${notesSection}

Mohon konfirmasi terkait perangkat yang akan digantikan.
terima kasih.

SACOM`;

        document.querySelector('#text_message').value = textMessage;
        return textMessage;
    }

    // Function to add new item row
    const addItem = () => {
        itemCount++;
        const container = document.querySelector('#items-container');
        const newRow = document.createElement('div');
        newRow.className = 'item-row grid grid-cols-1 md:grid-cols-4 gap-2 mb-2';
        newRow.innerHTML = `
            <div class="flex flex-col">
                <label>Nama Barang</label>
                <input class="border p-2 item-name" type="text" placeholder="Timing Belt" required autocomplete="off">
            </div>
            <div class="flex flex-col">
                <label>Qty Barang</label>
                <input class="border p-2 item-qty" type="number" placeholder="qty" value="1" required autocomplete="off">
            </div>
            <div class="flex flex-col">
                <label>Harga</label>
                <input class="border p-2 item-price" type="text" placeholder="1.000" value="1" required autocomplete="off">
            </div>
            <div class="flex flex-col">
                <label class="invisible">Action</label>
                <button class="remove-item py-2 bg-red-500 px-5 rounded-xl text-white h-10">
                    <div class="flex text-center items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </div>
                </button>
            </div>
        `;
        container.appendChild(newRow);
        
        // Add event listeners to new inputs
        newRow.querySelectorAll('input').forEach(input => {
            if (input.classList.contains('item-price')) {
                input.addEventListener('input', (e) => {
                    handlePriceInput(e.target);
                    generateMessage();
                });
            } else {
                input.addEventListener('input', generateMessage);
            }
        });
        
        // Add event listener to remove button
        newRow.querySelector('.remove-item').addEventListener('click', () => {
            if (document.querySelectorAll('.item-row').length > 1) {
                newRow.remove();
                generateMessage();
            }
        });
    }

    // Event listeners
    document.addEventListener('DOMContentLoaded', () => {
        // Add item button
        document.querySelector('#add_item').addEventListener('click', addItem);
        
        // Remove item buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.remove-item')) {
                if (document.querySelectorAll('.item-row').length > 1) {
                    e.target.closest('.item-row').remove();
                    generateMessage();
                }
            }
        });
        
        // WhatsApp button
        document.querySelector('#whatsapp_btn').addEventListener('click', () => {
            const phoneInput = document.querySelector('#customer_phone');
            const phone = formatPhoneNumber(phoneInput.value);
            const message = generateMessage();
            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
            window.open(whatsappUrl, '_blank');
        });
        
        // Input change listeners - pastikan semua input dan textarea termasuk notes
        document.querySelectorAll('input, textarea').forEach(input => {
            if (input.classList.contains('item-price')) {
                input.addEventListener('input', (e) => {
                    handlePriceInput(e.target);
                    generateMessage();
                });
            } else {
                input.addEventListener('input', generateMessage);
            }
        });
        
        // Khusus untuk textarea notes, pastikan event listener terpasang
        const notesTextarea = document.querySelector('#notes');
        if (notesTextarea) {
            notesTextarea.addEventListener('input', generateMessage);
        }
        
        // Generate initial message
        generateMessage();
    });