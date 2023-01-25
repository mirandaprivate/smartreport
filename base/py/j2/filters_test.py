# pylint:disable=missing-docstring
import unittest

from logi_base.src.py import filters


class TestTemplateFilters(unittest.TestCase):

    def test_regex_replace(self):
        # Pair[0] is originnal string.
        # Pair[1] is a regex string represent the string you want you repalce.
        # Pair[2] is the repalced content from the pair[1].
        # Pair[3] is the expected sting after the repalcing.
        data = [
            ['Helloed', r'ed$', '', 'Hello'],
            ['Helloed', r'ed', ' world', 'Hello world'],
            ['edHelloed', r'ed', '', 'Hello'],
        ]
        for pair in data:
            actual = filters.regex_replace(*pair[0:3])
            self.assertEqual(pair[3], actual)

    def test_to_nice_yml(self):
        originnal = '- {become: true, command: apt-mirror, name: apt-mirror}\n'
        expected = \
            '---\n- {become: true, command: apt-mirror, name: apt-mirror}\n'
        actual = filters.to_nice_yaml(originnal, explicit_start=True)
        self.assertEqual(expected, actual)

    def test_url_split(self):
        # Pair[0] is the url.
        # Pair[1] is the expected host name.
        # Pair[2] is the expected url path.
        data = [
            ['http://baidu.com', 'baidu.com', ''],
            ['http://baidu.com/video', 'baidu.com', 'video'],
            ['https://baidu.com/video/abc', 'baidu.com', 'video/abc'],
            ['baidu.com/video/abc', 'baidu.com', 'video/abc'],
            ['baidu.com', 'baidu.com', ''],
            ['baidu.com/abc', 'baidu.com', 'abc'],
        ]
        for pair in data:
            actual_host = filters.urlsplit(pair[0], 'hostname')
            actual_path = filters.urlsplit(pair[0], 'path')
            self.assertEqual(pair[1], actual_host)
            self.assertEqual(pair[2], actual_path)


if __name__ == '__main__':
    unittest.main()
