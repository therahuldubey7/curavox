from setuptools import setup, Command

class BuildCommand(Command):
    description = 'Build the application'
    user_options = []

    def initialize_options(self):
        pass

    def finalize_options(self):
        pass

    def run(self):
        # Add your build steps here
        # For example, using PyInstaller:
        import PyInstaller.__main__
        PyInstaller.__main__.run([
            'main.py',
            '--onefile',
            '--distpath=./dist'
        ])

setup(
    # ... other setup parameters ...
    cmdclass={
        'build': BuildCommand,
    },
)
