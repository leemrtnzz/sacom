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
    // Function to calculate total
    const calculateTotal = () => {
        let total = 0;
        document.querySelectorAll('.item-row').forEach(row => {
            const qty = parseInt(row.querySelector('.item-qty').value) || 0;
            const priceStr = row.querySelector('.item-price').value;
            const price = parseInt(unformatNumber(priceStr)) || 0;
            total += qty * price;
        });
        
        // Add service fee
        const serviceFeeInput = document.querySelector('#service_fee');
        const serviceFee = parseInt(unformatNumber(serviceFeeInput.value)) || 0;
        total += serviceFee;
        
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
        const serviceFeeInput = document.querySelector('#service_fee');

        const companyText = companyInput.value ? `- *${companyInput.value}*` : '';
        
        let itemsText = '';
        let subtotalItems = 0;
        document.querySelectorAll('.item-row').forEach(row => {
            const name = row.querySelector('.item-name').value;
            const qty = row.querySelector('.item-qty').value;
            const priceStr = row.querySelector('.item-price').value;
            const price = parseInt(unformatNumber(priceStr)) || 0;
            const subtotal = parseInt(qty) * price;
            subtotalItems += subtotal;
            itemsText += `- *${name}* *@ ${qty}* x Rp. *${formatNumber(price)}* = Rp. *${formatNumber(subtotal)}*\n`;
        });

        const serviceFee = parseInt(unformatNumber(serviceFeeInput.value)) || 0;
        const total = calculateTotal();
        
        // Add notes section if there's content
        const notesSection = notesTextarea.value ? `\n------ Catatan ------\n*${notesTextarea.value}*\n` : '';

        const textMessage = `Selamat ${periode()} Bpk/Ibu *${nameInput.value}* ${companyText}

Kami ingin memberitahukan terkait perangkat yang akan digantikan.

------ Detail Perangkat ------
Merk: *${brandInput.value}* - *${typeBrandInput.value}*
Serial Number: *${serialNumberInput.value}*
Masalah: *${problemTextarea.value}*

------ Pergantian Item ------
${itemsText}
Subtotal Item: *Rp. ${formatNumber(subtotalItems)}*
Biaya Layanan: *Rp. ${formatNumber(serviceFee)}*

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
        // Add visual feedback for required fields
        addVisualFeedback();
        
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
        
        // Copy button with validation
        document.querySelector('#copy_btn').addEventListener('click', async () => {
            const emptyFields = validateRequiredFields();
            
            if (emptyFields.length > 0) {
                showValidationError(emptyFields);
                return;
            }
            
            const message = generateMessage();
            const success = await copyToClipboard(message);
            
            if (success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: 'Pesan berhasil disalin ke clipboard',
                    timer: 1500,
                    showConfirmButton: false
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal!',
                    text: 'Gagal menyalin pesan ke clipboard',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#ef4444'
                });
            }
        });
        
        // WhatsApp button with validation
        document.querySelector('#whatsapp_btn').addEventListener('click', () => {
            const emptyFields = validateRequiredFields();
            
            if (emptyFields.length > 0) {
                showValidationError(emptyFields);
                return;
            }
            
            const phoneInput = document.querySelector('#customer_phone');
            const phone = formatPhoneNumber(phoneInput.value);
            const message = generateMessage();
            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
            
            // Show success message before redirect
            Swal.fire({
                icon: 'success',
                title: 'Form Lengkap!',
                text: 'Mengarahkan ke WhatsApp...',
                timer: 1500,
                showConfirmButton: false
            }).then(() => {
                window.open(whatsappUrl, '_blank');
            });
        });
        
        // Input change listeners - pastikan semua input dan textarea termasuk service fee
        document.querySelectorAll('input, textarea').forEach(input => {
            if (input.classList.contains('item-price') || input.id === 'service_fee') {
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

    // Function to copy text to clipboard
    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return true;
        }
    }

    // Function to validate required fields
    const validateRequiredFields = () => {
        const requiredFields = [
            { id: 'customer_name', label: 'Nama Pelanggan' },
            { id: 'customer_phone', label: 'Nomor Handphone' },
            { id: 'brand', label: 'Merk' },
            { id: 'type_brand', label: 'Type' },
            { id: 'serial_number', label: 'Serial Number' },
            { id: 'problem', label: 'Masalah' },
            { id: 'service_fee', label: 'Biaya Layanan' }
        ];

        const emptyFields = [];
        
        requiredFields.forEach(field => {
            const element = document.querySelector(`#${field.id}`);
            if (!element.value.trim()) {
                emptyFields.push(field.label);
            }
        });

        return emptyFields;
    }

    // Function to show validation error
    const showValidationError = (emptyFields) => {
        const fieldList = emptyFields.map(field => `${field}`).join('\n');
        
        Swal.fire({
            icon: 'error',
            title: 'Form Tidak Lengkap!',
            text: `Mohon lengkapi field bertanda *`,
            confirmButtonText: 'OK',
            confirmButtonColor: '#ef4444'
        });
    }

    // Function to add visual feedback for required fields
    const addVisualFeedback = () => {
        const requiredInputs = document.querySelectorAll('input[required], textarea[required]');
        
        requiredInputs.forEach(input => {
            input.addEventListener('blur', () => {
                if (!input.value.trim()) {
                    input.classList.add('border-red-500');
                    input.classList.remove('border-gray-300');
                } else {
                    input.classList.remove('border-red-500');
                    input.classList.add('border-gray-300');
                }
            });
            
            input.addEventListener('input', () => {
                if (input.value.trim()) {
                    input.classList.remove('border-red-500');
                    input.classList.add('border-gray-300');
                }
            });
        });
    }