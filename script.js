document.addEventListener('DOMContentLoaded', function () {
    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/dracula");
    editor.getSession().setMode("ace/mode/python");
    editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true
    });

    function openFile() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.py,.js,.html,.css,.txt,.java,.rb,.php,.cs,.md';

        fileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    editor.setValue(e.target.result);
                    updateEditorLanguage(file.name);
                };
                reader.readAsText(file);
            }
        });

        fileInput.click();
    }

    function saveFile() {
        const content = editor.getValue();
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'file.' + getFileExtension();
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    function updateEditorLanguage(fileName) {
        const fileExtension = fileName.split('.').pop();
        const mode = 'ace/mode/' + determineMode(fileExtension);
        editor.getSession().setMode(mode);
    }

    function getFileExtension() {
        const fileTypeSelector = document.getElementById('fileType');
        return fileTypeSelector.value;
    }

    function determineMode(fileExtension) {
        switch (fileExtension) {
            case 'js':
                return 'javascript';
            case 'html':
                return 'html';
            case 'css':
                return 'css';
            case 'txt':
                return 'text';
            case 'java':
                return 'java';
            case 'rb':
                return 'ruby';
            case 'php':
                return 'php';
            case 'cs':
                return 'csharp';
            case 'md':
                return 'markdown';
            default:
                return 'python';
        }
    }

    function undo() {
        editor.undo();
    }

    function redo() {
        editor.redo();
    }

    document.addEventListener('keydown', function (e) {
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            saveFile();
        } else if (e.ctrlKey && e.key === 'o') {
            e.preventDefault();
            openFile();
        } else if (e.ctrlKey && e.key === 'l') {
            e.preventDefault();
            const fileTypeSelector = document.getElementById('fileType');
            const currentIndex = fileTypeSelector.selectedIndex;
            fileTypeSelector.selectedIndex = (currentIndex + 1) % fileTypeSelector.options.length;
            const selectedLanguage = fileTypeSelector.value;
            const mode = 'ace/mode/' + determineMode(selectedLanguage);
            editor.getSession().setMode(mode);
        }
    });

    document.getElementById('theme').addEventListener('change', function () {
        const selectedTheme = this.value;
        editor.setTheme(selectedTheme);
    });

    document.getElementById('fileType').addEventListener('change', function () {
        const selectedLanguage = this.value;
        const mode = 'ace/mode/' + determineMode(selectedLanguage);
        editor.getSession().setMode(mode);
    });

    document.getElementById('fontSize').addEventListener('change', function () {
        const selectedFontSize = this.value + 'px';
        editor.setFontSize(selectedFontSize);
    });
});
