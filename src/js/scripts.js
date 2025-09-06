$(document).ready(function() {
    
    // Бургер-меню
    $(".burger").click(function() {
        $(".menu_box").toggleClass("active");
        $(this).toggleClass("active");
    });

    // Табы
    $('.tab-btn').on('click', function() {
        $('.tab-btn').removeClass('active');
        $(this).addClass('active');

        const tabId = $(this).data('tab');
        $('.tab-content').removeClass('active');
        $('#' + tabId).addClass('active');
        Fancybox.bind('[data-fancybox="gallery"]', {
            
        });
    });
    Fancybox.bind('[data-fancybox]', {
        // Your custom options for a specific gallery
    });

    // Инициализация кастомных селектов
    initCustomSelects();

    // Установка обработчиков для кастомных селектов
    setupCustomSelectHandlers();
    $(document).on('click', '[data-toggle="modal"]', function(e) {
        e.preventDefault();
        const target = $(this).data('target');
        $(target).fadeIn(200);
    });

    // Закрытие по кнопке .custom-modal-close
    $(document).on('click', '.custom-modal-close', function() {
        $(this).closest('.custom-modal').fadeOut(200);
    });

    // Закрытие при клике вне диалога
    $(document).on('click', '.custom-modal', function(e) {
        if ($(e.target).is('.custom-modal')) {
            $(this).fadeOut(200);
        }
    });

    $('.page-template-page-services-php .categories-filter a').on('click', function(e){
        e.preventDefault();
        let category = $(this).data('category');

        $('.page-template-page-services-php .categories-filter a').removeClass('active');
        $(this).addClass('active');

        $.ajax({
            url: '/wp-admin/admin-ajax.php', // WP сам знает admin-ajax.php
            type: 'POST',
            data: {
                action: 'filter_services',
                category: category,
            },
            beforeSend: function(){
                $('#services-list').html('<p>Завантаження...</p>');
            },
            success: function(res){
                $('#services-list').html(res);
            }
        });
    });
});

// Основная инициализация значений по умолчанию
function initCustomSelects() {
    $('.custom_select_wrapper').each(function() {
        const $wrapper = $(this);
        const $hiddenSelect = $wrapper.find('.hidden_select');
        const selectedValue = $hiddenSelect.val();

        if (selectedValue) {
            const $option = $wrapper.find(`.select_option[data-value="${selectedValue}"]`);
            if ($option.length) {
                $wrapper.find('.select_trigger span').text($option.text());
                $wrapper.find('.select_option').removeClass('selected');
                $option.addClass('selected');
            }
        }
    });
}

// Назначение обработчиков событий
function setupCustomSelectHandlers() {
    // Открытие/закрытие селекта
    $(document).on('click', '.select_trigger', function(e) {
        e.stopPropagation();
        const $select = $(this).closest('.custom_select');
        $('.custom_select').not($select).removeClass('open'); // Закрыть другие
        $select.toggleClass('open');
    });

    // Клик по опции
    $(document).on('click', '.select_option', function(e) {
        e.stopPropagation();
        const $option = $(this);
        const $select = $option.closest('.custom_select');
        const $trigger = $select.find('.select_trigger span');
        const $hiddenSelect = $select.closest('.custom_select_wrapper').find('.hidden_select');

        $trigger.text($option.text());
        $select.find('.select_option').removeClass('selected');
        $option.addClass('selected');
        $hiddenSelect.val($option.data('value')).trigger('change');
        $select.removeClass('open');

        // Коллбэк при выборе
        if (typeof customSelectCallback === 'function') {
            customSelectCallback($option.data('value'), $option.text());
        }
    });

    // Закрытие при клике вне селекта
    $(document).on('click', function() {
        $('.custom_select').removeClass('open');
    });

    // Предотвращаем закрытие при клике на options_container
    $(document).on('click', '.options_container', function(e) {
        e.stopPropagation();
    });
}

// Динамическое создание кастомного селекта
function createCustomSelect(containerId, options, defaultValue) {
    let html = `
        <div class="custom_select_wrapper">
            <div class="custom_select">
                <div class="select_trigger">
                    <span>${(options.find(opt => opt.value === defaultValue) || options[0]).text}</span>
                </div>
                <div class="options_container">
    `;

    let hiddenSelectOptions = '';

    options.forEach(option => {
        const isSelected = option.value === defaultValue;
        html += `<div class="select_option${isSelected ? ' selected' : ''}" data-value="${option.value}">${option.text}</div>`;
        hiddenSelectOptions += `<option value="${option.value}"${isSelected ? ' selected' : ''}>${option.text}</option>`;
    });

    html += `
                </div>
            </div>
            <select class="hidden_select" name="language">
                ${hiddenSelectOptions}
            </select>
        </div>
    `;

    $('#' + containerId).html(html);

    initCustomSelects();
    // Открытие модального окна

}
// CF7: показать модалку "спасибо" после успешной отправки и закрыть текущую
document.addEventListener('wpcf7mailsent', function (event) {
  // если нужно реагировать только на конкретную форму — раскомментируй строку ниже:
  // if (String(event.detail.contactFormId) !== '3547') return;

  const $form = $(event.target);
  const $currentModal = $form.closest('.custom-modal'); // то модальное, где была форма

  // закрываем текущее модальное (если открыто), затем открываем спасибо
  if ($currentModal.length) {
    $currentModal.fadeOut(200, function () {
      $('#thanks_Modal').fadeIn(200);
    });
  } else {
    $('#thanks_Modal').fadeIn(200);
  }

  // по желанию: сбросить форму
  try { $form[0].reset(); } catch (e) {}
}, false);