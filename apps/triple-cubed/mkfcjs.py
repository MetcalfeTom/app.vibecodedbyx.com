# wrap each front-coded list as a script (Triple Cubed v1.16): a page's "save complete" keeps the scripts it loaded, and a saved
# copy runs them from disk. A template literal keeps the newlines as they are, so the file is the list plus two lines
import sys, os
d = sys.argv[1]
for f in ('ai.fc', 't15.fc', 'words.fc'):
    t = open(os.path.join(d, f)).read()
    assert not any(c in t for c in '`\\$\r'), f
    open(os.path.join(d, f + '.js'), 'w').write('/* Triple Cubed word list ' + f + ', one front-coded word per line */\n(window.TCFC = window.TCFC || {})["' + f + '"] = `' + t + '`;\n')
    print(f, len(t), os.path.getsize(os.path.join(d, f + '.js')))
