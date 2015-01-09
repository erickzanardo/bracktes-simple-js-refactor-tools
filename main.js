define(function (require, exports, module) {
    "use strict";

    var CommandManager = brackets.getModule('command/CommandManager'),
        Menus = brackets.getModule('command/Menus'),
        EditorManager = brackets.getModule('editor/EditorManager'),
        Dialogs = brackets.getModule('widgets/Dialogs'),
        DefaultDialogs = brackets.getModule('widgets/DefaultDialogs'),
        DocumentManager = brackets.getModule('document/DocumentManager');

    var askDialog = function (title, message, defaultValue, c) {
        var dialog = Dialogs.showModalDialog(DefaultDialogs.DIALOG_ID_INFO, title, message + '<input type="text"/>', [{className: Dialogs.DIALOG_BTN_CLASS_PRIMARY, id: 'process', text: 'Process'}]);
        var d = dialog.getElement();
        if (defaultValue) {
            d.find('input').val(defaultValue);
        }
        d.find('input').focus();
        d.find('button').click(function () {
            c(d.find('input').val());
        });
    };

    var extractToVariable = function () {
        var editor = EditorManager.getCurrentFullEditor();
        var selectedText = editor.getSelectedText();
        if (selectedText) {
            var selection = editor.getSelection();
            askDialog('Extract to variable', '<label>Extract selection to variable:</label> ', '', function (value) {
                var code = ['var', value, '=', selectedText].join(' ');
                var doc = DocumentManager.getCurrentDocument();
                doc.replaceRange(code, selection.start, selection.end);
            });
        } else {
            Dialogs.showModalDialog(DefaultDialogs.DIALOG_ID_ERROR, 'Extract to variable', 'No text selected');
        }
    };

    var iterateOver = function () {
        var editor = EditorManager.getCurrentFullEditor();
        var selectedText = editor.getSelectedText();
        if (selectedText) {
            var selection = editor.getSelection();
            askDialog('Iterate over variable', '<label>Iterate over variable:</label> ', 'i', function (value) {
                var code = ['for (var', value, '= 0', ';', value, '<', selectedText + '.length', ';', value + '++)', '{}'].join(' ');
                var doc = DocumentManager.getCurrentDocument();
                doc.replaceRange(code, selection.start, selection.end);
                /*
                var pos = selection.start.ch + code.length - 1;
                editor.setCursorPos({line: selection.start.line, ch: pos});
                */
            });
        } else {
            Dialogs.showModalDialog(DefaultDialogs.DIALOG_ID_ERROR, 'Iterate over variable', 'No text selected');
        }
    };

    var EXTRACT_TO_VARIABLE_ID = 'refactor.extractToVariable';
    CommandManager.register('Extract to variable', EXTRACT_TO_VARIABLE_ID, extractToVariable);

    var ITERATE_OVER_ID = 'refactor.iterateOver';
    CommandManager.register('Iterate over variable', ITERATE_OVER_ID, iterateOver);

    var contextMenu = Menus.getContextMenu(Menus.ContextMenuIds.EDITOR_MENU);
    contextMenu.addMenuItem(EXTRACT_TO_VARIABLE_ID, 'Ctrl-1');
    contextMenu.addMenuItem(ITERATE_OVER_ID, 'Ctrl-2');
});