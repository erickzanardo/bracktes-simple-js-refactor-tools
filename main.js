define(function (require, exports, module) {
    "use strict";

    var CommandManager = brackets.getModule('command/CommandManager'),
        Menus = brackets.getModule('command/Menus'),
        EditorManager = brackets.getModule('editor/EditorManager'),
        Dialogs = brackets.getModule('widgets/Dialogs'),
        DefaultDialogs = brackets.getModule('widgets/DefaultDialogs'),
        DocumentManager = brackets.getModule('document/DocumentManager');

        var askDialog = function (title, message, c) {
            var dialog = Dialogs.showModalDialog(DefaultDialogs.DIALOG_ID_INFO, title, message + '<input type="text"/>' );
            var d = dialog.getElement();
            d.find('input').focus();
            d.find('button').click(function () {
                c(d.find('input').val());
            });
        }

    var extractToVariable = function () {
        var editor = EditorManager.getCurrentFullEditor();
        var selectedText = editor.getSelectedText();
        if (selectedText) {
            var selection = editor.getSelection();
            askDialog('Extract to variable', '<label>Extract selection to variable:</label> ', function (value) {
                var code = ['var', value, '=', selectedText].join(' ');
                var doc = DocumentManager.getCurrentDocument();
                doc.replaceRange(code, selection.start, selection.end);
            });
        } else {
            Dialogs.showModalDialog(DefaultDialogs.DIALOG_ID_ERROR, 'Extract to variable', 'No text selected');
        }
    }

    // First, register a command - a UI-less object associating an id to a handler
    var EXTRACT_TO_VARIABLE_ID = 'refactor.extractToVariable'; // package-style naming to avoid collisions
    CommandManager.register('Extract to variable', EXTRACT_TO_VARIABLE_ID, extractToVariable);

    var contextMenu = Menus.getContextMenu(Menus.ContextMenuIds.EDITOR_MENU);
    contextMenu.addMenuItem(EXTRACT_TO_VARIABLE_ID, 'Ctrl-1');
});