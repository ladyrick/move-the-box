#include<iostream>
#include<vector>
#include<fstream>
using std::cin;
using std::cout;
using std::endl;
using std::vector;
using std::ifstream;

class box
{
public:
	unsigned char type;
	bool show;
	box()
	{
		type = 0;
		show = false;
	}
	/*
	box& operator=(box &b)
	{
		this->type = b.type;
		this->show = b.show;
		return *this;
	}
	*/
};

vector<vector<int>> result(0, vector<int>(4));

void readPuzzle(vector<vector<box>> &puzzle, int &totalMove)
{
	ifstream fin("puzzle.txt", std::ios::in);
	if (fin.fail())
	{
		cout << "can't find puzzle.txt" << endl;
		exit(-1);
	}
	int t;
	for (int i = 8; i >= 0; i--)
	{
		for (int j = 0; j < 7; j++)
		{
			fin >> t;
			if (fin.fail())
			{
				cout << "can't read data from puzzle.txt" << endl;
				exit(-1);
			}
			if (t != 0)
			{
				puzzle[i][j].type = (unsigned char)t;
				puzzle[i][j].show = true;
			}
		}
	}
	fin >> t;
	if (fin.fail())
	{
		cout << "can't read data from puzzle.txt" << endl;
		exit(-1);
	}
	totalMove = t;
}

void showPuzzle(vector<vector<box>> puzzle, int totalMove = 0)
{
	cout << "-----------------\n";
	for (int i = 8; i >= 0; i--)
	{
		cout << "| ";
		for (int j = 0; j < 7; j++)
			if (puzzle[i][j].show)
				cout << (int)puzzle[i][j].type << ' ';
			else
				cout << "  ";
		cout << "|\n";
	}
	cout << "-----------------\n";
	if (totalMove == 1)
		cout << "it should be solved in " << totalMove << " step.\n";
	else if (totalMove > 1)
		cout << "it should be solved in " << totalMove << " steps.\n";
}

vector<vector<box>> exchangePuzzleNode(vector<vector<box>> puzzle, int x1, int y1, int x2, int y2)
{
	vector<vector<box>> p = puzzle;
	box t;
	t = p[x1][y1];
	p[x1][y1] = p[x2][y2];
	p[x2][y2] = t;

	bool finished = false;
	while (!finished)
	{
		finished = true;
		for (int i = 0; i < 9; i++)
			for (int j = 0; j < 5; j++)
				if (p[i][j].type != 0 && p[i][j].type == p[i][j + 1].type && p[i][j].type == p[i][j + 2].type)
				{
					finished = false;
					p[i][j].show = false;
					p[i][j + 1].show = false;
					p[i][j + 2].show = false;
				}
		for (int i = 0; i < 7; i++)
			for (int j = 0; j < 7; j++)
				if (p[i][j].type != 0 && p[i][j].type == p[i + 1][j].type && p[i][j].type == p[i + 2][j].type)
				{
					finished = false;
					p[i][j].show = false;
					p[i + 1][j].show = false;
					p[i + 2][j].show = false;
				}

		for (int j = 0; j < 7; j++)
		{
			vector<box> v;
			for (unsigned int i = 0; i < 9; i++)
			{
				if (p[i][j].show)
				{
					if (finished && i != (int)v.size())
						finished = false;
					v.push_back(p[i][j]);
				}
				p[i][j] = box();
			}
			for (unsigned int i = 0; i < v.size(); i++)
				p[i][j] = v[i];
		}
	}
	return p;
}

bool solvePuzzle(vector<vector<box>> puzzle, int totalMove)
{
	bool solved = true;
	for (int i = 0; i < 9; i++)
		for (int j = 0; j < 7; j++)
			if (puzzle[i][j].type != 0)
				solved = false;
	if (solved)
		return solved;
	else if (totalMove <= 0)
		return false;
	else
		for (int i = 0; i < 9; i++)
			for (int j = 0; j < 7; j++)
				for (int k = 0; k < 2; k++)
				{
					if (i == 0 && j == 4)
						int test = 0;
					int d[2][2] = { {1,0},{0,1} };
					int it = i + d[k][0];
					int jt = j + d[k][1];
					if (it < 9 && jt < 7 && puzzle[i][j].type != puzzle[it][jt].type)
					{
						if (solvePuzzle(exchangePuzzleNode(puzzle, i, j, it, jt), totalMove - 1))
						{
							result.push_back(vector<int>{ i + 1, j + 1, it + 1, jt + 1 });
							return true;
						}
					}
				}
	return false;
}

int main()
{
	vector<vector<box>> puzzle(9, vector<box>(7));
	int totalMove;
	readPuzzle(puzzle, totalMove);
	showPuzzle(puzzle, totalMove);
	if (solvePuzzle(puzzle, totalMove)) {
		if (result.size() > 0)
		{
			cout << "puzzle solved!" << endl;
			for (int i = result.size() - 1; i >= 0; i--)
				cout << "step " << result.size() - i <<
				": exchange (" << result[i][0] << ',' << result[i][1] <<
				") and (" << result[i][2] << ',' << result[i][3] << ");" << endl;
		}
		else
			cout << "it's already been solved." << endl;
	}
	else
		cout << "can't solve the puzzle." << endl;
	return 0;
}
