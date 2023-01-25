import {assertIsString} from '@logi/base/ts/common/assert'
import {ArgumentParser} from 'argparse'
import {writeFileSync} from 'fs'

function main(): void {
    const parser = new ArgumentParser()
    parser.addArgument('--output', {required: true})
    parser.addArgument('--content', {required: true})
    const args = parser.parseArgs()
    const output = args.output
    const content = args.content
    assertIsString(output)
    assertIsString(content)
    writeFileSync(output, content, {encoding: 'utf8'})
}

if (require.main === module)
    main()
